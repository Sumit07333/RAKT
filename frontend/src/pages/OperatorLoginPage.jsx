import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';
import FormField from '../components/common/FormField';
import Input from '../components/common/Input';
import { loginOperator } from '../services/authService';
import { validateEmail, validateRequiredText } from '../utils/validation';
import raktNaviLogo from '../assets/RaktNavi Logo.png';

export default function OperatorLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('coordinator@raktnavi.org');
  const [password, setPassword] = useState('access-coordinator');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) newErrors.email = emailCheck.error;

    const passCheck = validateRequiredText(password, 'Password', 6, 50);
    if (!passCheck.isValid) newErrors.password = passCheck.error;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await loginOperator({ email, password });
      navigate('/operator/dashboard');
    } catch (err) {
      setErrors({ form: err.message || 'Authentication failed. Please verify credentials.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#C41315] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8EC] p-6 sm:p-8 shadow-card text-[#273741]">
        <div className="text-center mb-6">
          <Link to="/" className="inline-block">
            <img
              src={raktNaviLogo}
              alt="RaktNavi logo"
              className="h-14 w-auto object-contain mx-auto mb-3"
            />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-[#273741]">
            Operations Console
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Authorized Blood Bank Inventory & Requisition Management
          </p>
        </div>

        {/* Access Notice */}
        <div className="mb-5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#273741]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Authorized Coordinator Access</span>
          </div>
          <p className="text-slate-600">
            Evaluation access enabled. Test credentials are pre-filled below for administrative inspection.
          </p>
        </div>

        {errors.form && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-[#C41315] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            id="operator-email"
            label="Operator / Coordinator Email"
            required
            error={errors.email}
          >
            <Input
              id="operator-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. coordinator@raktnavi.org"
              error={errors.email}
              icon={Mail}
              disabled={isLoading}
            />
          </FormField>

          <FormField
            id="operator-password"
            label="Password"
            required
            error={errors.password}
          >
            <div className="relative">
              <Input
                id="operator-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                error={errors.password}
                icon={Lock}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </FormField>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={isLoading}
          >
            Sign In to Operations Console
          </Button>
        </form>
      </div>

      <p className="text-center text-xs text-slate-400">
        RaktNavi Security Architecture • Role-Based Access Control
      </p>
    </div>
  );
}

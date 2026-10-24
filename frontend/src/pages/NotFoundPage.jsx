import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
        <Search className="w-8 h-8 text-[#C41315]" />
      </div>
      <span className="text-xs font-bold uppercase tracking-wider text-[#C41315]">
        404 — Page Not Found
      </span>
      <h1 className="text-3xl font-extrabold text-[#273741] mt-2 mb-3">
        Page Does Not Exist
      </h1>
      <p className="text-sm text-slate-600 mb-8 leading-relaxed">
        The route you navigated to does not exist or may have been moved. Return to the home page or search available blood stock.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link to="/">
          <Button variant="primary" icon={Home}>
            Back to Home
          </Button>
        </Link>
        <Link to="/find-blood">
          <Button variant="outline" icon={Search}>
            Search Blood
          </Button>
        </Link>
      </div>
    </div>
  );
}

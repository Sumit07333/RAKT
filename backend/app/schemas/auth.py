from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from pydantic.alias_generators import to_camel


class OperatorLoginRequest(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    email: str = Field(..., min_length=3, max_length=150)
    password: str = Field(..., min_length=1)


class OperatorUser(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: str
    name: str
    email: str
    role: str = "Blood Bank Operator"
    facility_id: str
    facility_name: str
    is_demo_session: bool = False


class OperatorLoginResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    success: bool = True
    token: str
    user: OperatorUser

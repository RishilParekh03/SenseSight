from pydantic import BaseModel
from typing import Optional


class TokenCreate(BaseModel):
    email: str
    password: str


class TokenSchema(BaseModel):
    user_id: int
    access_token: str
    token_type: str


class CreateAdmin(BaseModel):
    name: str
    username: str
    password: str


class GetAdmin(BaseModel):
    username: str
    password: str

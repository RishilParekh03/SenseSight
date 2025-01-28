from pydantic import BaseModel
from typing import Optional


class AdminInsert(BaseModel):
    name: str
    username: str
    password: str


class AdminFetch(BaseModel):
    id: Optional[int] = None
    username: str
    password: str


class Auth(BaseModel):
    name: str | None = None
    username: str | None = None
    password: str | None = None

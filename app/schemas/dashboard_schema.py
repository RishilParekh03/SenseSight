from pydantic import BaseModel


class UpdateProfile(BaseModel):
    name: str
    email: str

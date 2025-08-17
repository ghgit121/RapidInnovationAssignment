from pydantic import BaseModel
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    password: str
    role: str = "user"  # Default to user role

class UserResponse(BaseModel):
    id: int
    username: str
    role: str
    class Config:
        orm_mode = True  # Enables SQLAlchemy ORM compatibility

class Token(BaseModel):
    access_token: str
    token_type: str

class SearchRequest(BaseModel):
    query: str

class ImageRequest(BaseModel):
    prompt: str

class HistoryBase(BaseModel):
    type: str
    query: str
    result: str
    meta_data: str | None = None

class HistoryCreate(HistoryBase):
    pass

class HistoryResponse(HistoryBase):
    id: int
    user_id: int
    timestamp: datetime
    class Config:
        orm_mode = True
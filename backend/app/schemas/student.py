#backend/app/schemas/student.py


from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class StudentCreate(BaseModel):
    dni: str = Field(..., min_length=8, max_length=8)
    name: str = Field(..., min_length=3)
    email: EmailStr = Field(...)
    age: int = Field(..., gt=0, lt=100)
    gender: str = Field(...)
    classroom: str = Field(...)
    address: Optional[str] = None
    guardian_name: Optional[str] = None
    guardian_phone: Optional[str] = None
    photo_url: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "dni": "70203040",
                "name": "Arturo, Becerra Abad",
                "email": "arturo.becerra@zgroup.com.pe",
                "age": 16,
                "gender": "M",
                "classroom": "5to A",
                "address": "Av. Pedro Ruiz",
                "guardian_name": "Maria Abad",
                "guardian_phone": "922041633",
                "photo_url": "foto"
            }
        }

class StudentResponse(BaseModel):
    id: str
    dni: str
    name: str
    email: EmailStr
    age: int
    gender: str
    classroom: str
    address: Optional[str] = None
    guardian_name: Optional[str] = None
    guardian_phone: Optional[str] = None
    photo_url: Optional[str] = None

    class Config:
        from_attributes = True
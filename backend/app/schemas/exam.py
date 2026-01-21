# backend/app/schemas/exam.py

from pydantic import BaseModel, Field

class ExamCreate(BaseModel):
    student_id: str = Field(..., description="ID del estudiante")
    subject: str = Field(..., min_length=1, description="Nombre del curso") 
    score: float = Field(..., ge=0, le=20, description="Nota entre 0 y 20")

    class Config:
        json_schema_extra = {
            "example": {
                "student_id": "65a9f...",
                "subject": "Matemática",
                "score": 18.5
            }
        }

class ExamResponse(BaseModel):
    id: str
    student_id: str
    subject: str
    score: float
    exam_date: str

    class Config:
        from_attributes = True
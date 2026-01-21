import os
import motor.motor_asyncio
import logging
from bson import ObjectId

# Configuración de Logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ZTrackAPI")

MONGO_DETAILS = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "ztrack_db")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client[DB_NAME]

student_collection = database.get_collection("students")
exam_collection = database.get_collection("exams")

logger.info(f"Conectado a MongoDB: {DB_NAME}")

# --- HELPER DE ESTUDIANTES---
def student_helper(student) -> dict:
    return {
        "id": str(student["_id"]),
        "dni": student.get("dni", "N/A"),
        "name": student["name"],
        "email": student["email"],
        "age": student.get("age", 0),              
        "gender": student.get("gender", "M"),      
        "classroom": student.get("classroom", "-"),
        "address": student.get("address", ""),
        "guardian_name": student.get("guardian_name", ""),
        "guardian_phone": student.get("guardian_phone", ""),
        "photo_url": student.get("photo_url", "")
    }

def exam_helper(exam) -> dict:
    return {
        "id": str(exam["_id"]),
        "student_id": str(exam["student_id"]),
        "subject": exam["subject"],
        "score": exam["score"],
        "exam_date": str(exam["exam_date"]),
    }

# Modelo de Respuesta Genérica
def ResponseModel(data, message):
    return {
        "data": data,
        "code": 200,
        "message": message,
    }

def ErrorResponseModel(error, code, message):
    return {
        "error": error,
        "code": code,
        "message": message
    }
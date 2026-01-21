#backend\app\routes\exam.py

from fastapi import APIRouter, Body, HTTPException
from fastapi.encoders import jsonable_encoder
from bson import ObjectId
from datetime import datetime

from app.schemas.exam import ExamCreate
from app.db.database import (
    exam_collection, 
    student_collection, 
    exam_helper, 
    ResponseModel
)

router = APIRouter()

@router.post("", response_description="Nota registrada exitosamente")
async def add_exam_data(exam: ExamCreate = Body(...)):
    if not ObjectId.is_valid(exam.student_id):
        raise HTTPException(status_code=400, detail="ID de estudiante inválido")

    student_exists = await student_collection.find_one({"_id": ObjectId(exam.student_id)})
    if not student_exists:
        raise HTTPException(status_code=404, detail="El estudiante indicado no existe")

    exam_dict = jsonable_encoder(exam)
    # Convertimos la fecha a texto para evitar errores de formato
    exam_dict["exam_date"] = datetime.now().isoformat()

    new_exam = await exam_collection.insert_one(exam_dict)
    created_exam = await exam_collection.find_one({"_id": new_exam.inserted_id})
    
    return ResponseModel(exam_helper(created_exam), "Nota registrada correctamente")

@router.get("/{student_id}", response_description="Notas del estudiante")
async def get_student_exams(student_id: str):
    if not ObjectId.is_valid(student_id):
        raise HTTPException(status_code=400, detail="ID de estudiante inválido")

    exams = []
    async for exam in exam_collection.find({"student_id": student_id}):
        exams.append(exam_helper(exam))
    
    return ResponseModel(exams, "Notas recuperadas exitosamente")

@router.delete("/{id}", response_description="Nota eliminada")
async def delete_exam(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="ID inválido")

    exam = await exam_collection.find_one({"_id": ObjectId(id)})
    if exam:
        await exam_collection.delete_one({"_id": ObjectId(id)})
        return ResponseModel("Nota eliminada", "Eliminación exitosa")
    
    raise HTTPException(status_code=404, detail="Nota no encontrada")

# 5. PUT: Actualizar Nota
@router.put("/{id}", response_description="Nota actualizada")
async def update_exam(id: str, exam: ExamCreate = Body(...)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="ID inválido")

    # Solo actualizamos score y subject
    update_data = {
        "subject": exam.subject,
        "score": exam.score
    }

    result = await exam_collection.update_one(
        {"_id": ObjectId(id)}, {"$set": update_data}
    )

    if result.modified_count == 1:
        updated_exam = await exam_collection.find_one({"_id": ObjectId(id)})
        return ResponseModel(exam_helper(updated_exam), "Nota actualizada")
    
    # Si existe pero no hubo cambios
    existing = await exam_collection.find_one({"_id": ObjectId(id)})
    if existing:
        return ResponseModel(exam_helper(existing), "Sin cambios")

    raise HTTPException(status_code=404, detail="Nota no encontrada")


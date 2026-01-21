#\backend\app\routes\student.py

from fastapi import APIRouter, Body, HTTPException
from fastapi.encoders import jsonable_encoder
from bson import ObjectId

from app.schemas.student import StudentCreate
from app.db.database import (
    student_collection, 
    student_helper, 
    ResponseModel
)

router = APIRouter()

# 1. POST: Crear Estudiante
@router.post("", response_description="Estudiante registrado exitosamente")
async def add_student_data(student: StudentCreate = Body(...)):
    # Validar que no exista el DNI
    existing_dni = await student_collection.find_one({"dni": student.dni})
    if existing_dni:
        raise HTTPException(status_code=409, detail="Ya existe un estudiante con este DNI")

    # Validar que no exista el Email
    existing_email = await student_collection.find_one({"email": student.email})
    if existing_email:
        raise HTTPException(status_code=409, detail="Ya existe un estudiante con este correo electrónico")

    # Insertar
    student_dict = jsonable_encoder(student)
    new_student = await student_collection.insert_one(student_dict)
    created_student = await student_collection.find_one({"_id": new_student.inserted_id})
    
    return ResponseModel(student_helper(created_student), "Estudiante registrado correctamente")

# 2. GET: Listar Estudiantes
@router.get("", response_description="Lista de estudiantes recuperada")
async def get_students(limit: int = 50):
    students = []
    async for student in student_collection.find().limit(limit):
        students.append(student_helper(student))
    
    return ResponseModel(students, "Datos recuperados exitosamente")

# 3. DELETE: Eliminar Estudiante
@router.delete("/{id}", response_description="Estudiante eliminado")
async def delete_student(id: str):
    # Validamos que el ID sea válido antes de buscar
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="ID inválido")

    student = await student_collection.find_one({"_id": ObjectId(id)})
    if student:
        await student_collection.delete_one({"_id": ObjectId(id)})
        return ResponseModel("Estudiante eliminado", "Eliminación exitosa")
    
    raise HTTPException(status_code=404, detail="Estudiante no encontrado")

# 4. PUT: Actualizar estudiante
@router.put("/{id}", response_description="Estudiante actualizado")
async def update_student(id: str, req: StudentCreate = Body(...)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="ID inválido")

    # Convertimos los datos a diccionario
    req_dict = {k: v for k, v in req.dict().items() if v is not None}
    
    # Actualizamos en la BD
    update_result = await student_collection.update_one(
        {"_id": ObjectId(id)}, {"$set": req_dict}
    )

    if update_result.modified_count == 1:
        updated_student = await student_collection.find_one({"_id": ObjectId(id)})
        return ResponseModel(student_helper(updated_student), "Actualización exitosa")

    # Si no se modificó nada (pero el ID existe), devolvemos el actual
    existing_student = await student_collection.find_one({"_id": ObjectId(id)})
    if existing_student:
        return ResponseModel(student_helper(existing_student), "Sin cambios detectados")
    
    raise HTTPException(status_code=404, detail="Estudiante no encontrado")


# 5. GET: Obtener un estudiante por ID
@router.get("/{id}", response_description="Datos de un estudiante")
async def get_student_by_id(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="ID inválido")
    
    student = await student_collection.find_one({"_id": ObjectId(id)})
    if student:
        return ResponseModel(student_helper(student), "Estudiante encontrado")
    
    raise HTTPException(status_code=404, detail="Estudiante no encontrado")











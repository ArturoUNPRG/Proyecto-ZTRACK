# backend/app/main.py

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

# Importamos las rutas que creamos
from app.routes.student import router as StudentRouter
from app.routes.exam import router as ExamRouter

app = FastAPI(
    title="ZTRACK API",
    description="API para gestión de alumnos y exámenes de ZGROUP",
    version="1.0.0"
)

# --- CONFIGURACIÓN CORS (VITAL PARA REACT) ---
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- RUTAS ---
app.include_router(StudentRouter, tags=["Students"], prefix="/api/students")
app.include_router(ExamRouter, tags=["Exams"], prefix="/api/exams")

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Bienvenido a la API de ZTRACK - Estado: ONLINE 🚀"}

# --- MANEJADOR DE ERRORES 422 (CHIVATO) ---
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print(f"❌ ERROR DE VALIDACIÓN: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )
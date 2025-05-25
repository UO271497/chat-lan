from fastapi import APIRouter, HTTPException
from app.models import Usuario
from app.db import get_usuario, save_usuario, get_mensajes

router = APIRouter()

@router.get("/usuario")
async def consultar_usuario(direccion: str):
    user = await get_usuario(direccion)
    if user:
        return user
    raise HTTPException(status_code=404, detail="Usuario no encontrado")

@router.post("/usuario")
async def registrar_usuario(usuario: Usuario):
    await save_usuario(usuario)
    return {"ok": True}

# ✅ Añade este endpoint para el historial
@router.get("/mensajes")
async def historial():
    return await get_mensajes()
from app.db import get_usuario, save_usuario, get_mensajes, get_usuarios  # asegúrate de importar

@router.get("/usuarios")
async def lista_usuarios():
    return await get_usuarios()

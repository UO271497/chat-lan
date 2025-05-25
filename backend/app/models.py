from pydantic import BaseModel

class Message(BaseModel):
    username: str
    text: str

class Usuario(BaseModel):
    username: str
    direccion: str

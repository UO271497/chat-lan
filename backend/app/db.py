import aiosqlite
from app.models import Usuario, Message

DB_PATH = "chat.db"

async def init_db():
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
        CREATE TABLE IF NOT EXISTS usuarios (
            direccion TEXT PRIMARY KEY,
            username TEXT
        )""")
        await db.execute("""
        CREATE TABLE IF NOT EXISTS mensajes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            text TEXT
        )""")
        await db.commit()

async def get_usuario(direccion: str):
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute("SELECT username FROM usuarios WHERE direccion = ?", (direccion,))
        row = await cursor.fetchone()
        if row:
            return {"username": row[0]}
        return None

async def save_usuario(usuario: Usuario):
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("INSERT OR REPLACE INTO usuarios (direccion, username) VALUES (?, ?)", (usuario.direccion, usuario.username))
        await db.commit()

async def save_message(msg: Message):
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("INSERT INTO mensajes (username, text) VALUES (?, ?)", (msg.username, msg.text))
        await db.commit()
async def get_mensajes(limit: int = 50):
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute("SELECT username, text FROM mensajes ORDER BY id DESC LIMIT ?", (limit,))
        rows = await cursor.fetchall()
        return [{"username": u, "text": t} for u, t in reversed(rows)]

async def get_usuarios():
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute("SELECT username FROM usuarios")
        rows = await cursor.fetchall()
        return [r[0] for r in rows]

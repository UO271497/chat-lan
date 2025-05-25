from fastapi import WebSocket, WebSocketDisconnect
from app.messaging import publish, start_consumer
from app.models import Message
from app.db import save_message

clients = set()

async def handle_ws(websocket: WebSocket):
    await websocket.accept()
    clients.add(websocket)
    print("Cliente conectado")

    try:
        async for data in websocket.iter_text():
            try:
                await publish(data)
                msg = Message.model_validate_json(data)
                await save_message(msg)
            except Exception as e:
                print("Error al procesar mensaje:", e)
    except WebSocketDisconnect:
        print("Cliente desconectado")
    finally:
        clients.discard(websocket)

# ⚠️ Este bloque debe estar definido ANTES de llamar a start_consumer()
async def broadcast(msg: str):
    disconnected = []
    for client in clients:
        try:
            await client.send_text(msg)
        except Exception as e:
            print("Error enviando a cliente:", e)
            disconnected.append(client)
    for client in disconnected:
        clients.discard(client)

# ✅ Asegúrate de que esto está fuera de cualquier función
start_consumer(broadcast)

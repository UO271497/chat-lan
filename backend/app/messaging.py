import aio_pika
import asyncio

RABBITMQ_URL = "amqp://guest:guest@rabbit/"
QUEUE_NAME = "chat"

async def publish(message: str):
    connection = await aio_pika.connect_robust(RABBITMQ_URL)
    async with connection:
        channel = await connection.channel()
        await channel.default_exchange.publish(
            aio_pika.Message(body=message.encode()),
            routing_key=QUEUE_NAME
        )

def start_consumer(callback):
    async def consume():
        while True:
            try:
                print("Intentando conectar a RabbitMQ...")
                connection = await aio_pika.connect_robust(RABBITMQ_URL)
                print("✅ Conectado a RabbitMQ")
                channel = await connection.channel()
                queue = await channel.declare_queue(QUEUE_NAME, durable=True)

                async with queue.iterator() as q:
                    async for message in q:
                        async with message.process():
                            await callback(message.body.decode())
            except Exception as e:
                print("❌ Error al conectar o consumir de RabbitMQ:", e)
                await asyncio.sleep(3)  # espera antes de reintentar

    asyncio.create_task(consume())

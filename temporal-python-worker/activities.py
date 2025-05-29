from temporalio import activity
import asyncio

@activity.defn
async def say_hello(name: str) -> str:
    import uuid
    guid = str(uuid.uuid4())
    text = f"say_hello is invoked with name='{name}+{guid}'"

    print(text)
    return text

import asyncio
from temporalio.worker import Worker
from temporalio.client import Client

from activities import say_hello
from workflows import GreetingWorkflow

async def main():
    # Connect to the Temporal server (assumes it's running on localhost:7233)
    client = await Client.connect("localhost:7233")

    # Run the worker for a specific task queue
    # You worker can declare multiple workflows and activities
    # But you don't have to declare both, it can be only actvities or only workflows
    worker = Worker(
        client,
        task_queue="python",
        activities=[say_hello],
        workflows=[GreetingWorkflow],
    )

    print("Worker started. Listening for tasks...")
    await worker.run()

if __name__ == "__main__":
    asyncio.run(main())

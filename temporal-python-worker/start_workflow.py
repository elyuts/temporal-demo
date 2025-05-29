import asyncio
from temporalio.client import Client
from workflows import GreetingWorkflow

async def main():
    client = await Client.connect("localhost:7233")

    handle = await client.start_workflow(
        GreetingWorkflow.run,
        "Some Username",
        id="enhanced-workflow-id1",
        task_queue="python",
    )

    print("Workflow started.")



if __name__ == "__main__":
    asyncio.run(main())

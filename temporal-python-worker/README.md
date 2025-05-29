# Temporal Python Worker Example

This is a minimal example of a Temporal worker implemented in Python using the [Temporal Python SDK](https://docs.temporal.io/docs/python/introduction/).

The project demonstrates:
- A simple **activity**
- A **workflow** that calls the activity
- A standalone **workflow** using **timers**, **signals**, and **queries**
- A script to start workflows and interact with them

---

## 🛠 Requirements

- Python 3.8+
- Temporal server (e.g. via [Temporal's Docker Compose setup](https://github.com/temporalio/docker-compose))

---

## 📥 Installation

# Create and activate a virtual environment (optional but recommended)
```bash
python3 -m venv .venv
source .venv/bin/activate
```

# Install dependencies
```bash
pip install -r requirements.txt
```

## 🚀 Running the Worker

# Start your Temporal server locally (e.g. using Docker):
```bash
docker-compose up
```

# Then start the worker:
```bash
python worker.py
```

## 🧪 Starting a Workflow
In another terminal, run:
```bash
python start_workflow.py
```

## 📚 Resources

- [Temporal Python SDK Documentation](https://docs.temporal.io/docs/python/introduction/)
- [Temporal CLI (tctl)](https://docs.temporal.io/cli/tctl/)
- [Temporal Server Docker Compose Setup](https://github.com/temporalio/docker-compose)
- [Temporal Core Concepts](https://docs.temporal.io/concepts/what-is-temporal)
- [Temporal GitHub Repository](https://github.com/temporalio/temporal)

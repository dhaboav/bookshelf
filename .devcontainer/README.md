# Bookshelf Project - .devcontainer

This repository provides a unified development environment using Dev Containers that combines a Python (FastAPI) backend, a Node.js frontend, and a standalone MySQL database running via Docker Compose.

### Architecture Overview

- **Dev Container:** Runs the development workspace with Node.js and Python pre-installed.

- **Standalone Database(`sql-compose.yaml`):** Runs as an independent MySQL container outside the Dev Container lifecycle, ensuring persistent storage.

- **Networking:** The backend inside the Dev Container connects to the MySQL instance via `host.docker.internal:3306`, which is configured via the db host and port settings in `.env` file in root.

### Quick Start Guide

1.  **Configure Enviroment Variables:**

    Copy the `.env.example` file inside `./devcontainer` directory to create local `.env` configuration:

    ```bash
    cp .devcontainer/.env.example .devcontainer/.env
    ```

2. **Manage the Database Container:**

    Run and stop the standalone MySQL instance from project (`outside the dev container`):

    - **`Start Database:`**

      ```bash
      docker compose -f .devcontainer/sql-compose.yaml up
      ```
    - **`Stop Database:`**

      ```bash
      docker compose -f .devcontainer/sql-compose.yaml down
      ```
3. **Launch the Dev contaienr:**

    Open the project in VS Code and press `Ctl + Shift + P` (or `Cmd + Shift + P`on macOS) and select **Dev Containers: Reopen in Containers**.

4. **Run the Applicaton Services:**

    Once inside the container, open a split terminal to run the backend and frontend concurrently:

    - **Backend (FastAPI):**

      ```bash
      cd backend && fastapi dev app/main.py
      ```
    - **Frontend (Node.js):**

      ```bash
      npm --prefix frontend run dev -- --host
      ```

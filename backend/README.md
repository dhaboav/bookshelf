# Bookshelf Project - Backend

The backend is built with [FastAPI](https://fastapi.tiangolo.com/), [Alembic](https://alembic.sqlalchemy.org/), [Python](https://www.python.org/)


### Workflow (Non Docker)

Follow these steps to set up the project locally:

1. **Install Python dependencies:**

    Install the required Python packages using `pip`:

    ```bash
    pip install -r requirments.txt
    ```

3. **Set up the environment file:**

    Copy the `.env.example` file from root folder to `.env` inside `./backend` folder to configure environment variables:

    - **On Windows:**

        ```bash
        copy .env.example .env
        ```

    - **On macOS/Linux:**

        ```bash
        cp .env.example .env
        ```

4. **Run the backend project:**

    ```bash
        fastapi dev
    ```

# AI-Powered Content & Image Explorer

## Overview

The AI-Powered Content & Image Explorer is a full-stack application that allows users to perform web searches using the Tavily MCP search server, generate images from text using the Flux ImageGen MCP server, save and manage their search and image generation history, and authenticate securely.

**Deployed Link:** [https://ai-content-image-explorer-frontend.vercel.app/](https://ai-content-image-explorer-frontend.vercel.app/)

## Features

*   **Web Search:** Users can enter a query and retrieve web summaries using the Tavily MCP server.
*   **Image Generation:** Users can enter a prompt and generate AI-generated images using the Flux ImageGen MCP server.
*   **Dashboard:**
    *   View saved search results and generated images.
    *   Filter by type, date, or keyword.
    *   Edit or delete saved entries.
*   **Authentication & Authorization:**
    *   Register/Login functionality.
    *   JWT tokens for protected routes.
    *   Role-based access (basic user vs admin).
*   **Responsive Design:** Mobile-friendly design for accessibility on various devices.
*   **Light/Dark Mode:** Toggle between light and dark themes for user preference.

**Bonus Features:**

*   **Export Data:** Export saved data to CSV/PDF.

## Tech Stack

*   **Frontend:** React (with Tailwind CSS)
*   **Backend:** Python FastAPI
*   **Database:** PostgreSQL
*   **MCP Servers:**
    *   Web Search: tavily-mcp
    *   Image Generation: flux-imagegen-mcp-server

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

*   [Python 3.8+](https://www.python.org/downloads/)
*   [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/)
*   [PostgreSQL](https://www.postgresql.org/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd <repository_name>
    ```

2.  **Backend Setup:**

    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    pip install -r requirements.txt
    # Configure database settings in .env file
    cd ..
    ```

3.  **Frontend Setup:**

    ```bash
    cd frontend
    npm install
    cd ..
    ```

### Configuration

1.  **Backend Configuration:**

    *   Create a `.env` file in the `backend` directory with the following variables:

        ```
        DATABASE_URL=postgresql://user:password@host:port/database
        SECRET_KEY=<your_secret_key>
        ALGORITHM=HS256
        ACCESS_TOKEN_EXPIRE_MINUTES=30
        TAVILY_API_KEY=<your_tavily_api_key> # If required by tavily-mcp
        FLUX_IMAGEGEN_API_URL=<flux_imagegen_mcp_server_url>
        ```

    *   Update the `DATABASE_URL` with your PostgreSQL connection details.
    *   Generate a secure `SECRET_KEY` for JWT authentication.
    *   Obtain API keys for Tavily and Flux ImageGen MCP servers if required.

2.  **Frontend Configuration:**

    *   Create a `.env` file in the `frontend` directory with the following variables:

        ```
        REACT_APP_BACKEND_API_URL=http://localhost:8000 # Or your deployed backend URL
        ```

    *   Update the `REACT_APP_BACKEND_API_URL` with the URL of your deployed backend or local development server.

### Running the Application

1.  **Start the Backend:**

    ```bash
    cd backend
    uvicorn main:app --reload
    ```

2.  **Start the Frontend:**

    ```bash
    cd frontend
    npm start
    ```

3.  **Access the Application:**

    Open your web browser and navigate to the frontend URL (usually `http://localhost:3000`).

## API Documentation

The backend API is documented using Swagger/OpenAPI. You can access the documentation by navigating to `/docs` endpoint of your backend server (e.g., `http://localhost:8000/docs`).

### Endpoints

*   **/auth**:
    *   `POST /auth/register`: Register a new user.
    *   `POST /auth/login`: Login an existing user.
    *   `POST /auth/refresh`: Refresh JWT token.
*   **/search**:
    *   `POST /search/`: Query the web search MCP.
*   **/image**:
    *   `POST /image/`: Generate images via image MCP.
*   **/dashboard**:
    *   `GET /dashboard/`: Retrieve saved data.
    *   `POST /dashboard/`: Create a new entry.
    *   `PUT /dashboard/{id}`: Update an existing entry.
    *   `DELETE /dashboard/{id}`: Delete an entry.

## Testing

### Running Tests

To run all tests, use the following command:

```bash
# From the project root directory
npm run test
# Or
python -m pytest # For backend tests
```

### Test Coverage

The test suite includes:

*   **Unit Tests:** For backend logic using pytest or unittest.
*   **Integration Tests:** For MCP interactions.
*   **E2E Tests:** Using Playwright or Cypress for frontend-to-backend flow.

Tests cover:

*   User authentication.
*   Search/image workflows.
*   Dashboard actions.

## Contributing

We welcome contributions to this project! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with clear, descriptive messages.
4.  Submit a pull request.

## License

This project is open source and available under the [License Name] license.

## Contact

Sanket Singh - 1111sanketsingh@gmail.com

## Screenshots

Include screenshots of your application to showcase its features and design.

*   **Login Page:**
    ![Login Page](link_to_login_screenshot)
*   **Search Results:**
    ![Search Results](link_to_search_screenshot)
*   **Image Generation:**
    ![Image Generation](link_to_image_generation_screenshot)
*   **Dashboard:**
    ![Dashboard](link_to_dashboard_screenshot)

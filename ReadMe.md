# RecipeApp - A Full-Stack Recipe Sharing Platform

RecipeApp is a modern, feature-rich web application built with a decoupled architecture using Django and React. It allows users to register, log in, and share their favorite recipes with a community. Users can browse, search, filter, and "like" recipes created by others, as well as manage their own creations through a personal profile page.

This project was built to demonstrate a comprehensive understanding of full-stack development, from backend API design and database management with Docker to frontend state management and responsive UI design with modern tooling.

**https://sparkling-fox-51e459.netlify.app/** - *Live Server Demo*

---

## Features

- **Full CRUD Functionality:** Users can Create, Read, Update, and Delete their own recipes.
- **User Authentication:** Secure user registration and login system using JSON Web Tokens (JWT). Includes a robust, silent token refresh mechanism to keep users logged in seamlessly.
- **Recipe Interaction:** Users can view all recipes and "like" or "unlike" their favorites.
- **Advanced Filtering & Sorting:**
  - **Live Search:** Real-time search by keywords in recipe titles, descriptions, or ingredients, with debouncing for performance.
  - **Multi-Filtering:** Filter recipes by categories (e.g., Breakfast, Dinner) and dietary types (e.g., Vegetarian) simultaneously.
  - **Dynamic Sorting:** Sort recipes by popularity (most likes) or by creation date (newest/oldest).
- **Pagination:** The main recipe list is paginated to efficiently handle a large number of recipes.
- **User Profiles:** A dedicated profile page where users can view a gallery of all the recipes they've posted and see key stats like total recipes created and total likes received across all their recipes.
- **Responsive Design:** A mobile-first, fully responsive UI built with Tailwind CSS that provides an excellent user experience on all devices.
- **Architectural Patterns:**
    - **Decoupled Frontend/Backend:** Clear separation of concerns between the API and the client application.
    - **Layout Routes:** Uses modern routing techniques in React to provide different page layouts for authenticated areas versus public-facing pages like login/register.

---

## Technology Stack

### Backend (API)

- **Framework:** **Django**
- **API Layer:** **Django REST Framework (DRF)** for building a powerful and clean RESTful API.
- **Database:** **PostgreSQL** (running in a **Docker** container for a consistent development environment).
- **Authentication:** **djangorestframework-simplejwt** for secure JWT-based token authentication.
- **Filtering & Search:** **django-filter** and DRF's built-in filters for advanced querying capabilities.
- **CORS:** **django-cors-headers** to manage Cross-Origin Resource Sharing.
- **Database ORM:** Django's built-in ORM for safe and efficient database queries.

### Frontend (Client)

- **Framework:** **React**
- **Project Scaffolding:** **Vite** for a fast and modern development experience.
- **Routing:** **React Router DOM** for client-side routing in a Single Page Application (SPA).
- **Styling:** **Tailwind CSS** for a utility-first, responsive, and modern design system.
- **State Management:** **React Context API** for managing global user authentication state.
- **HTTP Client:** **Axios** with interceptors to automatically handle the JWT token refresh lifecycle, providing a seamless user session.
- **JWT Decoding:** **jwt-decode** for safely decoding JWTs on the client side.

---

## Local Development Setup

To run this project on your local machine, you will need **Python**, **Node.js**, and **Docker** installed.

### 1. Backend Setup

The backend relies on a PostgreSQL database running in a Docker container.

```bash
# Navigate to the backend directory
cd backend

# Create and activate a Python virtual environment
python -m venv venv
source venv/bin/activate  # On macOS/Linux
# venv\Scripts\activate    # On Windows

# Install the required Python packages
pip install -r requirements.txt

# --- Database Setup (Using Docker) ---
# 1. Make sure Docker Desktop is running on your machine.
# 2. The configuration is in the 'docker-compose.yml' file.
# 3. Start the database container in the background:
docker-compose up -d

# NOTE: Wait a few seconds for the database service to be ready.
# The DATABASES setting in 'recipeApp/settings.py' should be configured
# to connect to this Docker container.

# Run database migrations to create the tables
python manage.py migrate

# Create a superuser to access the Django admin panel at /admin
python manage.py createsuperuser

# Start the backend development server
python manage.py runserver

```

### 2. Frontend Setup

```bash
# Open a NEW terminal and navigate to the frontend directory
cd frontend

# Install the required npm packages
npm install

# Start the frontend development server
npm run dev
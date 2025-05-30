# Time Tracker Backend

## Environment File Requirements

The backend requires an environment file (.env) to configure various settings, including API ports, database connections, and JWT authentication. Below are the necessary environment variables that need to be set.

If you are unsure of this, the env/env.ts. Can offer you some help of what is needed or if it is even needed.

### Ports

API_PORT=<your_api_port> # The port on which the backend API will run.
FRONT_END_PORT=<your_front_end_port> # The port on which the frontend will run.

### Database connections

DATABASE_URL="<your_database_url>" # URL for the PostgreSQL database connection, including the database name, user, password, and host.

### Jwt Authentication

JWT_SECRET="<your_jwt_secret>" # Secret key for signing and verifying JWT tokens. This should be a strong, unique value.
JWT_EXPIRES_HOURS=<your_expiration_hours> # The number of hours the JWT token will be valid for.

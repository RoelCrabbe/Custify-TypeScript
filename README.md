# ⚡️ Custify Backend

<div align="center">

![Custify Backend Logo](https://img.shields.io/badge/Custify-Backend-orange?style=for-the-badge&logo=typescript)

**Powerful backend API for the modern CRM platform**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)](https://jwt.io/)

[![GitHub stars](https://img.shields.io/github/stars/RoelCrabbe/Custify-TypeScript?style=social)](https://github.com/RoelCrabbe/Custify-TypeScript/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/RoelCrabbe/Custify-TypeScript?style=social)](https://github.com/RoelCrabbe/Custify-TypeScript/network/members)
[![GitHub issues](https://img.shields.io/github/issues/RoelCrabbe/Custify-TypeScript)](https://github.com/RoelCrabbe/Custify-TypeScript/issues)

</div>

---

## 🚀 About Custify Backend

The Custify Backend is the robust server-side foundation powering the Custify CRM platform. Built with TypeScript and Next.js API routes, it provides a scalable, type-safe, and secure backend infrastructure for managing customer relationships, authentication, and data persistence.

This backend works seamlessly with the [Custify React Frontend](https://github.com/RoelCrabbe/Custify-React) and [Custify WebSocket Server](https://github.com/RoelCrabbe/Custify-WebSocket) to deliver a complete CRM solution.

### ✨ Key Features

- **🔒 JWT Authentication** - Secure user authentication and authorization
- **📊 RESTful API** - Well-structured API endpoints for all CRM operations
- **🔐 Type Safety** - Full TypeScript implementation for robust development
- **💾 Database Integration** - Seamless database operations and management
- **⚡ Real-time Support** - WebSocket integration for live updates
- **🛡️ Security First** - Industry-standard security practices and validation
- **📈 Scalable Architecture** - Built to handle growing business needs
- **🔍 Data Validation** - Comprehensive input validation and sanitization

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Next.js (API Routes)
- **Language**: TypeScript
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: SQL/NoSQL (configurable)
- **Validation**: Custom middleware
- **Security**: bcrypt, helmet, cors
- **HTTP Client**: Native fetch/axios

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Database system (PostgreSQL, MySQL, or MongoDB)
- [Custify WebSocket Server](https://github.com/RoelCrabbe/Custify-WebSocket) (optional, for real-time features)

### Quick Start

1. **Clone the repository**

    ```bash
    git clone https://github.com/RoelCrabbe/Custify-TypeScript.git
    cd Custify-TypeScript
    ```

2. **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    ```

3. **Environment Setup**

    Create a `.env` file in the root directory:

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3000
    NEXT_BASE_API_URL=http://localhost:8080
    DATABASE_URL="your-database-connection-string"
    JWT_SECRET="your-super-secret-jwt-key"
    JWT_EXPIRES_HOURS=8
    NEXT_WEBSOCKET_API_URL=ws://localhost:8765
    ```

4. **Database Setup**

    ```bash
    # Run database migrations (if applicable)
    npm run migrate

    # Seed initial data (optional)
    npm run seed
    ```

5. **Start the development server**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

6. **Verify API is running**

    Navigate to [http://localhost:8080/api/status](http://localhost:8080/api/status) to check server status.

## 🔧 Configuration

### Environment Variables

| Variable                 | Description                | Required | Default                 |
| ------------------------ | -------------------------- | -------- | ----------------------- |
| `NEXT_PUBLIC_API_URL`    | Frontend API URL           | ✅       | `http://localhost:3000` |
| `NEXT_BASE_API_URL`      | Backend base URL           | ✅       | `http://localhost:8080` |
| `DATABASE_URL`           | Database connection string | ✅       | -                       |
| `JWT_SECRET`             | JWT signing secret         | ✅       | -                       |
| `JWT_EXPIRES_HOURS`      | Token expiration time      | ✅       | `8`                     |
| `NEXT_WEBSOCKET_API_URL` | WebSocket server URL       | ❌       | `ws://localhost:8765`   |

### Security Configuration

```typescript
// Example JWT configuration
const jwtConfig = {
    secret: process.env.JWT_SECRET,
    expiresIn: `${process.env.JWT_EXPIRES_HOURS}h`,
    algorithm: 'HS256' as const,
};

// Example database configuration
const dbConfig = {
    url: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production',
};
```

## 📱 Usage

### Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:8080/api/customers
```

### Authentication Flow Example

```typescript
// Login request
const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
});

const { token, user } = await response.json();

// Use token for authenticated requests
const customersResponse = await fetch('/api/customers', {
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    },
});
```

### API Endpoints

```typescript
// Example API endpoints
GET    /api/customers          // Get all customers
POST   /api/customers          // Create customer
GET    /api/customers/:id      // Get customer by ID
PUT    /api/customers/:id      // Update customer
DELETE /api/customers/:id      // Delete customer

POST   /api/auth/login         // User login
POST   /api/auth/register      // User registration
POST   /api/auth/logout        // User logout
GET    /api/auth/me            // Get current user
```

## 🤝 Contributing

We welcome contributions to the Custify Backend! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Maintain API documentation
- Write comprehensive tests
- Use conventional commit messages
- Ensure proper error handling
- Implement proper validation
- Follow RESTful API conventions

## 📚 Documentation

For detailed API documentation, visit our [API Documentation Wiki](https://github.com/RoelCrabbe/Custify-TypeScript/wiki/API-Documentation) or run the development server and navigate to `/api/docs`.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Roel Crabbe**

- GitHub: [@RoelCrabbe](https://github.com/RoelCrabbe)

## 🔗 Related Projects

- **Frontend**: [Custify-React](https://github.com/RoelCrabbe/Custify-React) - React frontend for Custify CRM
- **WebSocket**: [Custify-WebSocket](https://github.com/RoelCrabbe/Custify-WebSocket) - Real-time WebSocket server
- **Mobile**: Coming soon - React Native mobile app

## 🙏 Acknowledgments

- Built with [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- Authentication powered by [JWT](https://jwt.io/)
- TypeScript for type safety
- Node.js runtime environment

## 📊 Project Status

**🚧 In Progress** - This project is actively being developed. Features and documentation may change frequently.

---

<div align="center">

**Star ⭐ this repository if you found it helpful!**

[Report Bug](https://github.com/RoelCrabbe/Custify-TypeScript/issues) · [Request Feature](https://github.com/RoelCrabbe/Custify-TypeScript/issues) · [Documentation](https://github.com/RoelCrabbe/Custify-TypeScript/wiki)

</div>

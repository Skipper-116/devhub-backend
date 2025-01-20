# DevHub Backend

The backend for **DevHub**, a collaborative developer platform where users can showcase projects, participate in coding challenges, and collaborate with other developers.

## Features

- **User Authentication**: Secure user login and registration using JWT.
- **Project Management**: CRUD operations for user projects.
- **Comment System**: Users can comment on projects.
- **MongoDB Integration**: Data persistence with Mongoose.
- **Validation and Error Handling**: Robust request validation and centralized error handling.

---

## Tech Stack

- **Node.js**: Runtime environment.
- **Express.js**: Backend framework.
- **TypeScript**: For type safety and better developer experience.
- **MongoDB**: NoSQL database.
- **Mongoose**: ODM for MongoDB.
- **Jest**: For testing the backend logic.

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.15.1 or later)
- [MongoDB](https://www.mongodb.com/try/download/community) (local or Atlas)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/Skipper-116/devhub-backend.git
   cd devhub-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   ```bash
   npm install -g nodemon
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and configure the following:

   ```sh
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   nodemon
   ```

---

## API Endpoints

### Authentication

- `POST /api/v1/auth/register`: Register a new user.
- `POST /api/v1/auth/login`: Log in a user and return a JWT.

### Projects

- `GET /api/v1/projects`: Fetch all projects.
- `POST /api/v1/projects`: Create a new project.
- `GET /api/v1/projects/:id`: Fetch a single project by ID.
- `PUT /api/v1/projects/:id`: Update a project by ID.
- `DELETE /api/v1/projects/:id`: Delete a project by ID.

### Comments

- `POST /api/v1/projects/:projectId/comments`: Add a comment to a project.
- `GET /api/v1/projects/:projectId/comments`: Get comments for a project.

---

## Testing

Run tests using Jest:

```bash
npm test
```

---

## Folder Structure

```plaintext
src/
├── config/          # Database and environment configurations
├── controllers/     # Route handlers
├── middlewares/     # Middleware for authentication, validation, etc.
├── models/          # Mongoose models
├── routes/          # API routes
├── utils/           # Helper functions
├── server.ts        # Entry point of the application
```

---

## Deployment

### Hosting

- Deploy the backend on platforms like **Render**, **Railway**, or **Cyclic**.

### Steps

1. Set up a hosting platform account.
2. Connect the GitHub repository.
3. Add environment variables in the hosting platform.
4. Deploy and access the backend via the provided URL.

---

## Contribution

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## License

This project is licensed under the [MIT License](LICENSE).

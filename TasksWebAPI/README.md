# Task Management API

A RESTful API for managing tasks built with Express.js.

## API Endpoints

### Tasks

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Task Schema

```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "dueDate": "ISO datetime string (optional)",
  "status": "pending | in-progress | completed",
  "priority": "low | medium | high"
}
```

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`.
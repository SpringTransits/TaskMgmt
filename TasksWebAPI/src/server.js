import express from 'express';
import cors from 'cors';
import { z } from 'zod';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for tasks
const tasks = new Map();

// Task schema validation
const TaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  status: z.enum(['pending', 'in-progress', 'completed']).default('pending'),
  priority: z.enum(['low', 'medium', 'high']).default('medium')
});

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Get all tasks
app.get('/api/tasks', (req, res) => {
  res.json(Array.from(tasks.values()));
});

// Get a specific task
app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.get(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

// Create a new task
app.post('/api/tasks', (req, res) => {
  try {
    const taskData = TaskSchema.parse(req.body);
    const id = crypto.randomUUID();
    const task = {
      id,
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    tasks.set(id, task);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.errors });
  }
});

// Update a task
app.put('/api/tasks/:id', (req, res) => {
  try {
    const id = req.params.id;
    const existingTask = tasks.get(id);
    
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const taskData = TaskSchema.parse(req.body);
    const updatedTask = {
      ...existingTask,
      ...taskData,
      updatedAt: new Date().toISOString()
    };

    tasks.set(id, updatedTask);
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.errors });
  }
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const id = req.params.id;
  if (!tasks.has(id)) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  tasks.delete(id);
  res.status(204).send();
});

// Apply error handler
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Task Management API running at http://localhost:${port}`);
});
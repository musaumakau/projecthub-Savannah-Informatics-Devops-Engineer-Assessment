require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const promClient = require('prom-client');
const pool = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Create a Registry
const register = new promClient.Registry();

// Add default metrics (CPU, memory, etc.)
promClient.collectDefaultMetrics({ 
  register,
  prefix: 'projecthub_'
});

// Custom metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [register]
});

const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

const dbQueryDuration = new promClient.Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1],
  registers: [register]
});

const tasksTotal = new promClient.Gauge({
  name: 'tasks_total',
  help: 'Total number of tasks',
  registers: [register]
});

const tasksCompleted = new promClient.Gauge({
  name: 'tasks_completed',
  help: 'Number of completed tasks',
  registers: [register]
});


app.use(cors());
app.use(bodyParser.json());

// Metrics middleware - track request duration and count
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestDuration
      .labels(req.method, route, res.statusCode)
      .observe(duration);
    
    httpRequestTotal
      .labels(req.method, route, res.statusCode)
      .inc();
  });
  
  next();
});


// Metrics endpoint for Prometheus to scrape
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Health check with more details
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await pool.query('SELECT 1');
    res.status(200).json({ 
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString() 
    });
  }
});


// Health check (legacy endpoint)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  const start = Date.now();
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    dbQueryDuration.labels('select').observe((Date.now() - start) / 1000);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create task
app.post('/api/tasks', async (req, res) => {
  const { title, priority } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  const start = Date.now();
  try {
    const result = await pool.query(
      'INSERT INTO tasks (title, priority) VALUES ($1, $2) RETURNING *',
      [title, priority || 'medium']
    );
    dbQueryDuration.labels('insert').observe((Date.now() - start) / 1000);
    
    // Update task count metrics
    updateTaskMetrics();
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update task
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  
  const start = Date.now();
  try {
    const result = await pool.query(
      'UPDATE tasks SET completed = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [completed, id]
    );
    dbQueryDuration.labels('update').observe((Date.now() - start) / 1000);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Update task count metrics
    updateTaskMetrics();
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete task
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  
  const start = Date.now();
  try {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    dbQueryDuration.labels('delete').observe((Date.now() - start) / 1000);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Update task count metrics
    updateTaskMetrics();
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get task statistics
app.get('/api/stats', async (req, res) => {
  const start = Date.now();
  try {
    const totalResult = await pool.query('SELECT COUNT(*) FROM tasks');
    const completedResult = await pool.query('SELECT COUNT(*) FROM tasks WHERE completed = true');
    dbQueryDuration.labels('select').observe((Date.now() - start) / 1000);
    
    res.json({
      total: parseInt(totalResult.rows[0].count),
      completed: parseInt(completedResult.rows[0].count),
      pending: parseInt(totalResult.rows[0].count) - parseInt(completedResult.rows[0].count)
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update task metrics in background
async function updateTaskMetrics() {
  try {
    const totalResult = await pool.query('SELECT COUNT(*) FROM tasks');
    const completedResult = await pool.query('SELECT COUNT(*) FROM tasks WHERE completed = true');
    
    tasksTotal.set(parseInt(totalResult.rows[0].count));
    tasksCompleted.set(parseInt(completedResult.rows[0].count));
  } catch (error) {
    console.error('Error updating task metrics:', error);
  }
}

// Update metrics on startup and periodically
updateTaskMetrics();
setInterval(updateTaskMetrics, 30000); // Update every 30 seconds

// START SERVER 
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Metrics available at http://localhost:${PORT}/metrics`);
  console.log(`❤️  Health check at http://localhost:${PORT}/health`);
});
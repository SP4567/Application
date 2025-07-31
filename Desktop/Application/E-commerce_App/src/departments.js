
import express from 'express';
import sqlite3 from 'sqlite3';
import path from 'path';

const app = express();
const PORT = 3002;
const dbPath = path.resolve('E-commerce_App', 'src', 'ecommerce.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// GET /departments - List all departments
app.get('/departments', (req, res) => {
  db.all('SELECT id, name FROM departments', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    res.json({ departments: rows });
  });
});

// GET /departments/:id/products - List products for a department
app.get('/departments/:id/products', (req, res) => {
  const departmentId = req.params.id;
  db.all(
    `SELECT p.* FROM products p WHERE p.department_id = ?`,
    [departmentId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
      res.json({ products: rows });
    }
  );
});

// Handle 404 for other routes
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Departments API running on http://localhost:${PORT}`);
});

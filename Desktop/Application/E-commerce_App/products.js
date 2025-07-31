import express from 'express';
import sqlite3 from 'sqlite3';

const app = express();
const PORT = 3001;

import path from 'path';
const dbPath = path.resolve('E-commerce_App', 'src', 'ecommerce.db');
const db = new sqlite3.Database(dbPath, (err) => {
// Connect to SQLite database
// const db = new sqlite3.Database('ecommerce.db', (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// GET /products - List all products

app.get('/products', (req, res) => {
  db.all(
    `SELECT p.*, d.name as department_name FROM products p LEFT JOIN departments d ON p.department_id = d.id`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
      res.json({ products: rows });
    }
  );
});

// GET /products/:id - Get product by id

app.get('/products/:id', (req, res) => {
  const id = req.params.id;
  db.get(
    `SELECT p.*, d.name as department_name FROM products p LEFT JOIN departments d ON p.department_id = d.id WHERE p.id = ?`,
    [id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ product: row });
    }
  );
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
    `SELECT p.*, d.name as department_name FROM products p LEFT JOIN departments d ON p.department_id = d.id WHERE p.department_id = ?`,
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
  console.log(`Server running on http://localhost:${PORT}`);
});

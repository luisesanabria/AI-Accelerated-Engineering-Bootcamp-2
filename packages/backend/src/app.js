const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Database = require('better-sqlite3');
const { normalizeTodoName, buildTodoUpdatePayload } = require('./todoValidation');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize in-memory SQLite database
const db = new Database(':memory:');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert some initial data
const initialItems = ['Item 1', 'Item 2', 'Item 3'];
const insertStmt = db.prepare('INSERT INTO items (name, completed) VALUES (?, 0)');

initialItems.forEach(item => {
  insertStmt.run(item);
});

console.log('In-memory database initialized with sample data');

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend server is running' });
});

// API Routes
app.get('/api/items', (req, res) => {
  try {
    const items = db
      .prepare('SELECT id, name, completed, created_at FROM items ORDER BY created_at DESC')
      .all();
    res.json(items.map((item) => ({ ...item, completed: Boolean(item.completed) })));
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

app.post('/api/items', (req, res) => {
  try {
    const name = normalizeTodoName(req.body?.name);
    if (!name) {
      return res.status(400).json({ error: 'Item name is required' });
    }

    const result = insertStmt.run(name);
    const id = result.lastInsertRowid;

    const newItem = db.prepare('SELECT id, name, completed, created_at FROM items WHERE id = ?').get(id);
    res.status(201).json({ ...newItem, completed: Boolean(newItem.completed) });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

app.patch('/api/items/:id', (req, res) => {
  try {
    const itemId = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(itemId)) {
      return res.status(400).json({ error: 'Valid item ID is required' });
    }

    const existingItem = db.prepare('SELECT id FROM items WHERE id = ?').get(itemId);
    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const updatePayload = buildTodoUpdatePayload(req.body || {});
    if (updatePayload.error) {
      return res.status(400).json({ error: updatePayload.error });
    }

    const fields = [];
    const values = [];

    if (Object.prototype.hasOwnProperty.call(updatePayload.values, 'name')) {
      fields.push('name = ?');
      values.push(updatePayload.values.name);
    }

    if (Object.prototype.hasOwnProperty.call(updatePayload.values, 'completed')) {
      fields.push('completed = ?');
      values.push(updatePayload.values.completed ? 1 : 0);
    }

    values.push(itemId);

    db.prepare(`UPDATE items SET ${fields.join(', ')} WHERE id = ?`).run(...values);

    const updatedItem = db
      .prepare('SELECT id, name, completed, created_at FROM items WHERE id = ?')
      .get(itemId);

    res.json({ ...updatedItem, completed: Boolean(updatedItem.completed) });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

app.delete('/api/items/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid item ID is required' });
    }

    const existingItem = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const deleteStmt = db.prepare('DELETE FROM items WHERE id = ?');
    const result = deleteStmt.run(id);

    if (result.changes > 0) {
      res.json({ message: 'Item deleted successfully', id: parseInt(id) });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = { app, db, insertStmt };
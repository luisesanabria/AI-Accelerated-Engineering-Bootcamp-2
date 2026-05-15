import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { removeTodo, sortTodos, upsertTodo } from './utils/todoUtils';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTodoName, setNewTodoName] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const todoStats = useMemo(() => {
    const completed = todos.filter((todo) => todo.completed).length;
    return {
      total: todos.length,
      completed,
      pending: todos.length - completed,
    };
  }, [todos]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/items');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setTodos(sortTodos(result));
      setError(null);
    } catch (err) {
      setError('Failed to fetch todos: ' + err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (e) => {
    e.preventDefault();

    if (!newTodoName.trim()) {
      setError('Todo name cannot be empty');
      return;
    }

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newTodoName }),
      });

      if (!response.ok) {
        throw new Error('Failed to create todo');
      }

      const result = await response.json();
      setTodos((prev) => sortTodos(upsertTodo(prev, result)));
      setNewTodoName('');
      setError(null);
    } catch (err) {
      setError('Error creating todo: ' + err.message);
      console.error('Error creating todo:', err);
    }
  };

  const handleToggleTodo = async (todo) => {
    try {
      const response = await fetch(`/api/items/${todo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      const updatedTodo = await response.json();
      setTodos((prev) => sortTodos(upsertTodo(prev, updatedTodo)));
      setError(null);
    } catch (err) {
      setError('Error updating todo: ' + err.message);
      console.error('Error updating todo:', err);
    }
  };

  const startEditing = (todo) => {
    setEditingTodoId(todo.id);
    setEditingName(todo.name);
  };

  const cancelEditing = () => {
    setEditingTodoId(null);
    setEditingName('');
  };

  const handleSaveEdit = async (todoId) => {
    if (!editingName.trim()) {
      setError('Todo name cannot be empty');
      return;
    }

    try {
      const response = await fetch(`/api/items/${todoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editingName }),
      });

      if (!response.ok) {
        throw new Error('Failed to rename todo');
      }

      const updatedTodo = await response.json();
      setTodos((prev) => sortTodos(upsertTodo(prev, updatedTodo)));
      cancelEditing();
      setError(null);
    } catch (err) {
      setError('Error renaming todo: ' + err.message);
      console.error('Error renaming todo:', err);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      const response = await fetch(`/api/items/${todoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      setTodos((prev) => removeTodo(prev, todoId));
      setError(null);
    } catch (err) {
      setError('Error deleting todo: ' + err.message);
      console.error('Error deleting todo:', err);
    }
  };

  return (
    <div className="App">
      <header className="hero">
        <h1>Todo Planner</h1>
        <p>Planifica, completa y limpia tus tareas en un solo lugar.</p>
      </header>

      <main className="content">
        <section className="panel">
          <h2>Nueva tarea</h2>
          <form onSubmit={handleCreateTodo} className="create-form">
            <input
              type="text"
              aria-label="New todo name"
              value={newTodoName}
              onChange={(e) => setNewTodoName(e.target.value)}
              placeholder="Ejemplo: Preparar demo"
            />
            <button type="submit">Crear</button>
          </form>

          <div className="stats" aria-label="Todo stats">
            <span>Total: {todoStats.total}</span>
            <span>Pendientes: {todoStats.pending}</span>
            <span>Completadas: {todoStats.completed}</span>
          </div>

          {error && <p className="error">{error}</p>}
        </section>

        <section className="panel">
          <h2>Mis tareas</h2>
          {loading && <p>Loading todos...</p>}
          {!loading && todos.length === 0 && <p>No hay tareas. Crea la primera.</p>}
          {!loading && todos.length > 0 && (
            <ul className="todo-list" aria-label="Todo list">
              {todos.map((todo) => (
                <li key={todo.id} className={todo.completed ? 'todo-item completed' : 'todo-item'}>
                  <label>
                    <input
                      type="checkbox"
                      aria-label={`Toggle ${todo.name}`}
                      checked={todo.completed}
                      onChange={() => handleToggleTodo(todo)}
                    />
                  </label>

                  {editingTodoId === todo.id ? (
                    <input
                      type="text"
                      aria-label="Edit todo name"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                    />
                  ) : (
                    <span>{todo.name}</span>
                  )}

                  <div className="actions">
                    {editingTodoId === todo.id ? (
                      <>
                        <button type="button" onClick={() => handleSaveEdit(todo.id)}>
                          Guardar
                        </button>
                        <button type="button" className="secondary" onClick={cancelEditing}>
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button type="button" className="secondary" onClick={() => startEditing(todo)}>
                        Editar
                      </button>
                    )}

                    <button
                      type="button"
                      className="danger"
                      onClick={() => handleDeleteTodo(todo.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
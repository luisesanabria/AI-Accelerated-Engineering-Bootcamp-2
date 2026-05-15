import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

const server = setupServer(
  rest.get('/api/items', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, name: 'Test Item 1', completed: false, created_at: '2023-01-01T00:00:00.000Z' },
        { id: 2, name: 'Test Item 2', completed: true, created_at: '2023-01-02T00:00:00.000Z' },
      ])
    );
  }),

  rest.post('/api/items', (req, res, ctx) => {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res(ctx.status(400), ctx.json({ error: 'Item name is required' }));
    }

    return res(
      ctx.status(201),
      ctx.json({
        id: 3,
        name,
        completed: false,
        created_at: new Date().toISOString(),
      })
    );
  }),

  rest.patch('/api/items/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const payload = await req.json();

    return res(
      ctx.status(200),
      ctx.json({
        id: Number(id),
        name: payload.name || 'Test Item 1',
        completed: payload.completed ?? false,
        created_at: new Date().toISOString(),
      })
    );
  }),

  rest.delete('/api/items/:id', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ message: 'Item deleted successfully', id: Number(req.params.id) }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App Component', () => {
  test('renders main title and stats', async () => {
    render(<App />);

    expect(screen.getByText('Todo Planner')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Total: 2')).toBeInTheDocument();
      expect(screen.getByText('Pendientes: 1')).toBeInTheDocument();
      expect(screen.getByText('Completadas: 1')).toBeInTheDocument();
    });
  });

  test('loads and displays todos', async () => {
    render(<App />);

    expect(screen.getByText('Loading todos...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
      expect(screen.getByText('Test Item 2')).toBeInTheDocument();
    });
  });

  test('creates a new todo', async () => {
    const user = userEvent.setup();

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText('Loading todos...')).not.toBeInTheDocument();
    });

    const input = screen.getByLabelText('New todo name');
    await user.type(input, 'New Test Item');
    await user.click(screen.getByText('Crear'));

    await waitFor(() => {
      expect(screen.getByText('New Test Item')).toBeInTheDocument();
    });
  });

  test('shows an API error state', async () => {
    server.use(
      rest.get('/api/items', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch todos/)).toBeInTheDocument();
    });
  });

  test('allows marking todo as completed and deleting todo', async () => {
    const user = userEvent.setup();

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText('Toggle Test Item 1'));

    await waitFor(() => {
      expect(screen.getByText('Completadas: 2')).toBeInTheDocument();
    });

    const todoRow = screen.getByText('Test Item 1').closest('li');
    await user.click(within(todoRow).getByRole('button', { name: 'Eliminar' }));

    await waitFor(() => {
      expect(screen.queryByText('Test Item 1')).not.toBeInTheDocument();
    });
  });

  test('shows empty state when no todos', async () => {
    server.use(
      rest.get('/api/items', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('No hay tareas. Crea la primera.')).toBeInTheDocument();
    });
  });
});
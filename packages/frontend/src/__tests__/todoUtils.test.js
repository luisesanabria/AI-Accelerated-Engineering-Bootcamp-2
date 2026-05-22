import { filterTodos, removeTodo, sortTodos, upsertTodo } from '../utils/todoUtils';

describe('todoUtils', () => {
  it('upsertTodo adds missing todo', () => {
    const list = [{ id: 1, name: 'A', completed: false }];
    const result = upsertTodo(list, { id: 2, name: 'B', completed: true });

    expect(result).toHaveLength(2);
    expect(result[1].id).toBe(2);
  });

  it('upsertTodo updates existing todo', () => {
    const list = [{ id: 1, name: 'A', completed: false }];
    const result = upsertTodo(list, { id: 1, name: 'A updated', completed: true });

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ id: 1, name: 'A updated', completed: true });
  });

  it('removeTodo deletes one item by id', () => {
    const list = [
      { id: 1, name: 'A', completed: false },
      { id: 2, name: 'B', completed: true },
    ];

    expect(removeTodo(list, 1)).toEqual([{ id: 2, name: 'B', completed: true }]);
  });

  it('sortTodos keeps pending first and then newest ids', () => {
    const list = [
      { id: 1, name: 'Done', completed: true },
      { id: 3, name: 'Pending new', completed: false },
      { id: 2, name: 'Pending old', completed: false },
    ];

    const result = sortTodos(list);

    expect(result.map((t) => t.id)).toEqual([3, 2, 1]);
  });

  describe('filterTodos', () => {
    const list = [
      { id: 1, name: 'Pending task', completed: false },
      { id: 2, name: 'Done task', completed: true },
    ];

    it('returns all todos when filter is "all"', () => {
      expect(filterTodos(list, 'all')).toHaveLength(2);
    });

    it('returns only pending todos when filter is "pending"', () => {
      const result = filterTodos(list, 'pending');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('returns only completed todos when filter is "completed"', () => {
      const result = filterTodos(list, 'completed');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    it('returns all todos for unknown filter values', () => {
      expect(filterTodos(list, 'unknown')).toHaveLength(2);
    });
  });
});

import { removeTodo, sortTodos, upsertTodo } from '../utils/todoUtils';

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
});

export function upsertTodo(todos, todo) {
  const index = todos.findIndex((item) => item.id === todo.id);
  if (index === -1) {
    return [...todos, todo];
  }

  const updated = [...todos];
  updated[index] = todo;
  return updated;
}

export function removeTodo(todos, todoId) {
  return todos.filter((todo) => todo.id !== todoId);
}

export function sortTodos(todos) {
  return [...todos].sort((a, b) => {
    if (a.completed !== b.completed) {
      return Number(a.completed) - Number(b.completed);
    }

    return b.id - a.id;
  });
}

export function filterTodos(todos, filter) {
  if (filter === 'pending') return todos.filter((t) => !t.completed);
  if (filter === 'completed') return todos.filter((t) => t.completed);
  return todos;
}

function normalizeTodoName(name) {
  if (typeof name !== 'string') {
    return null;
  }

  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function buildTodoUpdatePayload(payload) {
  const hasName = Object.prototype.hasOwnProperty.call(payload, 'name');
  const hasCompleted = Object.prototype.hasOwnProperty.call(payload, 'completed');

  if (!hasName && !hasCompleted) {
    return { error: 'At least one field (name or completed) is required' };
  }

  const values = {};

  if (hasName) {
    const normalizedName = normalizeTodoName(payload.name);
    if (!normalizedName) {
      return { error: 'Item name is required' };
    }
    values.name = normalizedName;
  }

  if (hasCompleted) {
    if (typeof payload.completed !== 'boolean') {
      return { error: 'Completed must be a boolean value' };
    }
    values.completed = payload.completed;
  }

  return { values };
}

module.exports = {
  normalizeTodoName,
  buildTodoUpdatePayload,
};

const { normalizeTodoName, buildTodoUpdatePayload } = require('../../src/todoValidation');

describe('todoValidation helpers', () => {
  describe('normalizeTodoName', () => {
    it('returns trimmed string for valid values', () => {
      expect(normalizeTodoName('  Buy milk  ')).toBe('Buy milk');
    });

    it('returns null for empty strings', () => {
      expect(normalizeTodoName('   ')).toBeNull();
    });

    it('returns null for non-string values', () => {
      expect(normalizeTodoName(null)).toBeNull();
      expect(normalizeTodoName(123)).toBeNull();
    });
  });

  describe('buildTodoUpdatePayload', () => {
    it('returns error when payload has no updatable fields', () => {
      expect(buildTodoUpdatePayload({})).toEqual({
        error: 'At least one field (name or completed) is required',
      });
    });

    it('returns error when completed is not boolean', () => {
      expect(buildTodoUpdatePayload({ completed: 'true' })).toEqual({
        error: 'Completed must be a boolean value',
      });
    });

    it('returns normalized values for valid updates', () => {
      expect(buildTodoUpdatePayload({ name: '  Task  ', completed: true })).toEqual({
        values: { name: 'Task', completed: true },
      });
    });
  });
});

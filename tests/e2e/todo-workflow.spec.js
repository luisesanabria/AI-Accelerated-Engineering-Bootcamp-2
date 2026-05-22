const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('Todo workflow', () => {
  test('shows empty state when there are no todos', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await expect(page.getByText('Todo Planner')).toBeVisible();
    await expect(page.getByText('Total: 0')).toBeVisible();
  });

  test('user can create a new todo', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.createTodo('Buy groceries');

    await expect(todoPage.todoItem('Buy groceries')).toBeVisible();
    await expect(page.getByText('Total: 1')).toBeVisible();
    await expect(page.getByText('Pendientes: 1')).toBeVisible();
  });

  test('user can complete a todo', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.createTodo('Read a book');
    await todoPage.toggleCheckbox('Read a book').click();

    await expect(page.getByText('Completadas: 1')).toBeVisible();
  });

  test('user can rename a todo', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.createTodo('Draft email');
    await todoPage.renameTodo('Draft email', 'Send email to team');

    await expect(todoPage.todoItem('Send email to team')).toBeVisible();
    await expect(todoPage.todoItem('Draft email')).not.toBeVisible();
  });

  test('user can delete a todo', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.createTodo('Temporary task');
    await todoPage.deleteButtonFor('Temporary task').click();

    await expect(todoPage.todoItem('Temporary task')).not.toBeVisible();
  });

  test('user can filter todos by status', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.createTodo('Pending todo');
    await todoPage.createTodo('Done todo');
    await todoPage.toggleCheckbox('Done todo').click();

    await todoPage.filterBy('pending');
    await expect(todoPage.todoItem('Pending todo')).toBeVisible();
    await expect(todoPage.todoItem('Done todo')).not.toBeVisible();

    await todoPage.filterBy('completed');
    await expect(todoPage.todoItem('Done todo')).toBeVisible();
    await expect(todoPage.todoItem('Pending todo')).not.toBeVisible();

    await todoPage.filterBy('all');
    await expect(todoPage.todoItem('Pending todo')).toBeVisible();
    await expect(todoPage.todoItem('Done todo')).toBeVisible();
  });

  test('user can clear all completed todos', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.createTodo('Keep this');
    await todoPage.createTodo('Clear this');
    await todoPage.toggleCheckbox('Clear this').click();

    await todoPage.clearCompleted();

    await expect(todoPage.todoItem('Keep this')).toBeVisible();
    await expect(todoPage.todoItem('Clear this')).not.toBeVisible();
  });
});

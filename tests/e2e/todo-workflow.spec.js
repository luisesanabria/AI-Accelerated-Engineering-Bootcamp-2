const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('Todo workflow', () => {
  test('user can create, complete, rename and delete a todo', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.goto();
    await expect(page.getByText('Todo Planner')).toBeVisible();

    await todoPage.createTodo('Prepare release notes');
    await expect(todoPage.todoItem('Prepare release notes')).toBeVisible();

    await todoPage.toggleCheckbox('Prepare release notes').click();
    await expect(page.getByText('Completadas: 1')).toBeVisible();

    await todoPage.renameTodo('Prepare release notes', 'Prepare final release notes');
    await expect(todoPage.todoItem('Prepare final release notes')).toBeVisible();

    await todoPage.deleteButtonFor('Prepare final release notes').click();
    await expect(todoPage.todoItem('Prepare final release notes')).not.toBeVisible();
  });
});

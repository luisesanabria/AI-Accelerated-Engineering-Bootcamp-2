class TodoPage {
  constructor(page) {
    this.page = page;
    this.newTodoInput = page.getByLabel('New todo name');
    this.createButton = page.getByRole('button', { name: 'Crear' });
    this.todoList = page.getByLabel('Todo list');
  }

  async goto() {
    await this.page.goto('/');
  }

  async createTodo(name) {
    await this.newTodoInput.fill(name);
    await this.createButton.click();
  }

  todoItem(name) {
    return this.todoList.getByText(name);
  }

  toggleCheckbox(name) {
    return this.page.getByLabel(`Toggle ${name}`);
  }

  editButtonFor(name) {
    return this.page.locator('li', { hasText: name }).getByRole('button', { name: 'Editar' });
  }

  deleteButtonFor(name) {
    return this.page.locator('li', { hasText: name }).getByRole('button', { name: 'Eliminar' });
  }

  async renameTodo(oldName, newName) {
    await this.editButtonFor(oldName).click();
    await this.page.getByLabel('Edit todo name').fill(newName);
    await this.page.getByRole('button', { name: 'Guardar' }).click();
  }
}

module.exports = { TodoPage };

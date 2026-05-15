const request = require('supertest');
const { app } = require('../../src/app');

describe('Todos API integration', () => {
  it('supports create, update (name + completed), and delete flows', async () => {
    const createResponse = await request(app)
      .post('/api/items')
      .send({ name: 'Walk the dog' })
      .set('Accept', 'application/json');

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toMatchObject({
      name: 'Walk the dog',
      completed: false,
    });

    const todoId = createResponse.body.id;

    const updateResponse = await request(app)
      .patch(`/api/items/${todoId}`)
      .send({ name: 'Walk the dog at 7am', completed: true })
      .set('Accept', 'application/json');

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toMatchObject({
      id: todoId,
      name: 'Walk the dog at 7am',
      completed: true,
    });

    const deleteResponse = await request(app).delete(`/api/items/${todoId}`);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toEqual({
      message: 'Item deleted successfully',
      id: todoId,
    });
  });

  it('returns 400 for invalid update payloads', async () => {
    const createResponse = await request(app)
      .post('/api/items')
      .send({ name: 'Temporary task' })
      .set('Accept', 'application/json');

    const todoId = createResponse.body.id;

    const badResponse = await request(app)
      .patch(`/api/items/${todoId}`)
      .send({ completed: 'yes' })
      .set('Accept', 'application/json');

    expect(badResponse.status).toBe(400);
    expect(badResponse.body).toEqual({
      error: 'Completed must be a boolean value',
    });
  });
});

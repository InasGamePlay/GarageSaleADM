test('API responde corretamente', async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/comments');

  expect(response.status).toBe(200);
});
import AppError from './AppError';

describe('Error base class', () => {
  const error = new AppError('error message', 411);
  test('error should return their message', () => {
    expect(error.getMessage()).toBe('error message');
  });
  test('error should return their status code', () => {
    expect(error.getStatusCode()).toBe(411);
  });
});

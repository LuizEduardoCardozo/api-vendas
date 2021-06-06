import { createConnection, getRepository } from 'typeorm';
import User from '../entities/Users';
import UserRepository from './user.repository';

describe('user repository', () => {
  beforeAll(async () => {
    await createConnection({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [User],
      synchronize: true,
    });
  });
  afterEach(async () => {
    const users = await getRepository(User).find({});
    await getRepository(User).remove(users);
  });
  test('should add a new user', async () => {
    const userRepository = new UserRepository();
    const insertedUser = await userRepository.add({
      name: 'Eduardo',
      email: 'valid@mail.com',
      password: 'olamundo',
      avatar: 'none',
    });
    const repo = getRepository(User);
    const foundUsers = await repo.findByIds(insertedUser.identifiers);
    expect(foundUsers).toHaveLength(1);
  });
  test('should find a user by their name', async () => {
    const userRepository = new UserRepository();
    await userRepository.add({
      name: 'Eduardo',
      email: 'valid@mail.com',
      password: 'olamundo',
      avatar: 'none',
    });
    const foundUser = await userRepository.findByName('Eduardo');
    expect(foundUser).not.toBeUndefined();
  });
  test('should find a user by their email', async () => {
    const userRepository = new UserRepository();
    await userRepository.add({
      name: 'Eduardo',
      email: 'valid@mail.com',
      password: 'olamundo',
      avatar: 'none',
    });
    const foundUser = await userRepository.findByEmail('valid@mail.com');
    expect(foundUser).not.toBeUndefined();
  });
  test('should find a user by their id', async () => {
    const userRepository = new UserRepository();
    const insertedUser = await userRepository.add({
      name: 'Eduardo',
      email: 'valid@mail.com',
      password: 'olamundo',
      avatar: 'none',
    });
    const insertedUserId = insertedUser.identifiers[0].id;
    const foundUser = await userRepository.findById(insertedUserId);
    expect(foundUser).not.toBeUndefined();
  });
});

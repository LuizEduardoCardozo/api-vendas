import { createConnection, getRepository } from 'typeorm';
import User from '../typeorm/entities/Users';
import UserRepository from '../typeorm/repositories/user.repository';
import ListUsersService from './ListUsers.service';

describe('list users service', () => {
  beforeAll(() => {
    return createConnection({
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
  test('should return a empty array if no user was found', async () => {
    const listUsersService = new ListUsersService();
    const foundUsers = await listUsersService.execute();
    expect(foundUsers).toHaveLength(0);
  });
  test('should not return the user password', async () => {
    const userData = {
      email: 'mail@mail.com',
      avatar: 'any',
      name: 'Eduardo',
      password: 'olamundo',
    };
    const userRepository = new UserRepository();
    await userRepository.add(userData);
    const listUsersService = new ListUsersService();
    const [foundUser] = await listUsersService.execute();
    expect(foundUser.password).toBeUndefined();
  });
  test('should return the name, the user email and the avatar', async () => {
    const userData = {
      email: 'mail@mail.com',
      avatar: 'any',
      name: 'Eduardo',
      password: 'olamundo',
    };
    const userRepository = new UserRepository();
    await userRepository.add(userData);
    const listUsersService = new ListUsersService();
    const [foundUser] = await listUsersService.execute();
    expect(foundUser.name).not.toBeUndefined();
    expect(foundUser.email).not.toBeUndefined();
    expect(foundUser.avatar).not.toBeUndefined();
  });
});

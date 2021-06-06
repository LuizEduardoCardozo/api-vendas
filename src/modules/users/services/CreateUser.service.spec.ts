import { createConnection, getRepository } from 'typeorm';
import AppError from '../../../shared/errors/AppError';
import User from '../typeorm/entities/Users';
import UserRepository from '../typeorm/repositories/user.repository';
import CreateUserService from './CreateUser.service';

describe('create new user', () => {
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
  test('shoud return a error if the email alredy exists', async () => {
    const userData = {
      email: 'mail@mail.com',
      avatar: 'any',
      name: 'Eduardo',
      password: 'olamundo',
    };
    const userRepository = new UserRepository();
    await userRepository.add(userData);
    const createUserService = new CreateUserService();
    let error;
    try {
      await createUserService.execute(userData);
    } catch (e) {
      error = true;
      expect(e).toStrictEqual(new AppError('User already exists', 409));
    }
    expect(error).toBeTruthy();
  });
  test('shoud create a new user', async () => {
    const userData = {
      email: 'mail@mail.com',
      avatar: 'any',
      name: 'Eduardo',
      password: 'olamundo',
    };
    const createUserService = new CreateUserService();
    await createUserService.execute(userData);
    const userRepository = new UserRepository();
    const foundUser = await userRepository.findByEmail(userData.email);
    expect(foundUser).not.toBeUndefined();
  });
});

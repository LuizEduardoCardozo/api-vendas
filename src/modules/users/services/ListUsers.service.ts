import { getRepository } from 'typeorm';
import User from '../typeorm/entities/Users';

// TO DO - change querybuilder logic to repository
export default class ListUsersService {
  public async execute(): Promise<User[]> {
    const userRepository = getRepository(User);
    return userRepository
      .createQueryBuilder('users')
      .select(['users.name', 'users.email', 'users.avatar'])
      .getMany();
  }
}

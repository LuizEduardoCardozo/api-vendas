import {
  EntityRepository,
  getRepository,
  InsertResult,
  Repository,
} from 'typeorm';
import User from '../entities/Users';

interface AddUser {
  name: string;
  email: string;
  password: string;
  avatar: string;
}

@EntityRepository(User)
export default class UserRepository extends Repository<User> {
  private userRepository = getRepository(User);
  public async add(userData: AddUser): Promise<InsertResult> {
    return this.userRepository.insert(userData);
  }
  public async findByName(name: string): Promise<User | undefined> {
    const foundUser = await this.userRepository.findOne({
      where: {
        name,
      },
    });
    return foundUser;
  }
  public async findByEmail(email: string): Promise<User | undefined> {
    const foundUser = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    return foundUser;
  }
  public async findById(id: string): Promise<User | undefined> {
    const foundUser = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    return foundUser;
  }
}

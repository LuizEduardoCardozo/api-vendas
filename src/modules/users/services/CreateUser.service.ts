import AppError from '../../../shared/errors/AppError';
import UserRepository from '../typeorm/repositories/user.repository';

interface CreateUser {
  name: string;
  email: string;
  avatar: string;
  password: string;
}

export default class CreateUserService {
  public async execute(userData: CreateUser): Promise<void> {
    const { name, email, avatar, password } = userData;
    const userRepository = new UserRepository();
    const foundUser = await userRepository.findByEmail(email);
    if (foundUser) {
      throw new AppError('User already exists', 409);
    }
    await userRepository.add({
      name,
      password,
      email,
      avatar,
    });
  }
}

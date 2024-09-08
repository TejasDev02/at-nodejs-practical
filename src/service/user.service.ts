import { throwDeprecation } from 'process';
import { AppDataSource } from '../config/database.config';
import { User } from '../entity/user';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret'; // Store this securely in an environment variable

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async register(username: string, email: string, password: string) {
    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ username, email, password: hashedPassword });
    await this.userRepository.save(user);
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new Error('Invalid email');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    return { token };
  }

  async getUserDetails(userId: number) {
    return await this.userRepository.findOne({ where:{id: userId }});
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

     if(!user) throw new Error("User not found");

    if (!(await bcrypt.compare(oldPassword, user.password))) {
      throw new Error('Old password is incorrect');
    }
    if(await bcrypt.compare(oldPassword, user.password)){
      throw new Error('New password same as old password enter other');

    }
    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);
    return true
  }
}

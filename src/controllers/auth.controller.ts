import { inject } from '@loopback/context';
import { repository, Getter } from '@loopback/repository';
import {
  AuthenticationBindings,
  UserProfile,
  authenticate
} from '@loopback/authentication';
import { get, post, requestBody } from '@loopback/rest';
import { User } from '../models';
import { UserRepository } from '../repositories';

export class AuthController {
  constructor(
    @inject.getter(AuthenticationBindings.CURRENT_USER, { optional: true })
    private getCurrentUser: Getter<UserProfile>,
    @repository(UserRepository)
    public userRepository: UserRepository
  ) {}

  @authenticate('BasicStrategy')
  @get('/auth/login', {
    security: [
      {
        basicAuth: []
      }
    ],
    responses: {
      '200': {
        description: 'Logged in User model instance',
        content: {
          'application/json': { schema: { 'x-ts-type': User } }
        }
      }
    }
  })
  async login(): Promise<User> {
    const currentUser = await this.getCurrentUser();
    return await this.userRepository.findById(currentUser.id);
  }

  @post('/auth/register', {
    responses: {
      '200': {
        description: 'User model instance',
        content: { 'application/json': { schema: { 'x-ts-type': User } } }
      }
    }
  })
  async create(@requestBody() user: User): Promise<User> {
    return await this.userRepository.create(user);
  }
}

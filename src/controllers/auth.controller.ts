import { inject } from '@loopback/context';
import { repository, Getter } from '@loopback/repository';
import {
  AuthenticationBindings,
  UserProfile,
  authenticate
} from '@loopback/authentication';
import {
  get,
  post,
  requestBody,
  param,
  RestBindings,
  Response
} from '@loopback/rest';
import { User } from '../models';
import { UserRepository } from '../repositories';
import { HydraBindings, Hydra } from '../providers';

export class AuthController {
  constructor(
    @inject(RestBindings.Http.RESPONSE) private res: Response,
    @inject.getter(AuthenticationBindings.CURRENT_USER, { optional: true })
    private getCurrentUser: Getter<UserProfile>,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(HydraBindings.HYDRA_CLIENT) public hydra: Hydra
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
        description: 'User model instance',
        content: {
          'application/json': { schema: { 'x-ts-type': User } }
        }
      }
    }
  })
  async login(
    @param.query.string('challenge') challenge?: string
  ): Promise<User> {
    const currentUser = await this.getCurrentUser();
    const user = await this.userRepository.findById(currentUser.id);
    if (challenge) {
      const res: any = await this.hydra.acceptLoginRequest(challenge, {
        subject: user.email,
        remember: true,
        remember_for: 3600
      });
      console.log('login', res);
      this.res.redirect(res.redirect_to);
    }
    return user;
  }

  @authenticate('BasicStrategy')
  @get('/auth/consent', {
    security: [
      {
        basicAuth: []
      }
    ],
    responses: {
      '200': {
        description: 'User model instance'
      }
    }
  })
  async consent(
    @param.query.string('challenge') challenge?: string
  ): Promise<null> {
    if (challenge) {
      try {
        const res: any = await this.hydra.acceptConsentRequest(challenge, {
          grant_scope: ['some-scope'],
          session: {},
          remember: true,
          remember_for: 3600
        });
        console.log('consent', res);
        this.res.redirect(res.redirect_to);
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
    return null;
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

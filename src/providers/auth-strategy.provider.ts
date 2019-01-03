import * as bcrypt from 'bcrypt-nodejs';
import { BasicStrategy } from 'passport-http';
import { Provider, inject, ValueOrPromise } from '@loopback/context';
import { Request } from '@loopback/rest';
import { Strategy } from 'passport';
import { repository } from '@loopback/repository';
import {
  AuthenticationBindings,
  AuthenticationMetadata,
  UserProfile
} from '@loopback/authentication';
import { UserRepository } from '../repositories';
import { User } from '../models';

export class AuthStrategyProvider implements Provider<Strategy | undefined> {
  constructor(
    @inject(AuthenticationBindings.METADATA)
    private metadata: AuthenticationMetadata,
    @repository(UserRepository)
    public userRepository: UserRepository
  ) {}

  value(): ValueOrPromise<Strategy | undefined> {
    if (!this.metadata) return undefined;
    const name = this.metadata.strategy;
    switch (name) {
      case 'BasicStrategy':
        return new BasicStrategy(
          {
            passReqToCallback: true
          },
          this.verifyBasic.bind(this)
        );
      default:
        return Promise.reject(`The strategy ${name} is not available.`);
    }
  }

  async verifyBasic(
    _req: Request,
    email: string,
    password: string,
    done: (err: Error | null, user?: UserProfile | false) => void
  ) {
    let user: User | null = null;
    const users = await this.userRepository.find({
      where: { email }
    });
    if (users.length) [user] = users;
    if (user && bcrypt.compareSync(password, user.password || '')) {
      return done(null, {
        id: <string>user.id
      });
    }
    return done(null, false);
  }
}

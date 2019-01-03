import * as path from 'path';
import { ApplicationConfig } from '@loopback/core';
import { BootMixin } from '@loopback/boot';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import {
  AuthenticationBindings,
  AuthenticationComponent
} from '@loopback/authentication';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import * as pkg from '../package.json';
import {
  AuthStrategyProvider,
  HydraBindings,
  HydraProvider
} from './providers';
import { MySequence } from './sequence';

export class IdentityApiApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication))
) {
  bootOptions = {
    controllers: {
      dirs: ['controllers'],
      extensions: ['.controller.js'],
      nested: true
    }
  };

  constructor(options: ApplicationConfig = {}) {
    super({
      ...options,
      rest: {
        ...options.rest,
        host: '0.0.0.0'
      }
    });
    this.projectRoot = __dirname;
    this.addComponents();
    this.addBindings();
    this.addSequences();
    this.addHome();
    this.addExplorer();
    this.api({
      openapi: '3.0.0',
      info: {
        title: pkg.name,
        version: pkg.version
      },
      paths: {},
      components: {
        securitySchemes: {
          basicAuth: {
            scheme: 'basic',
            type: 'http'
          },
          bearerAuth: {
            scheme: 'bearer',
            type: 'http'
          }
        }
      }
    });
  }

  addBindings() {
    this.bind(AuthenticationBindings.STRATEGY).toProvider(AuthStrategyProvider);
    this.bind(HydraBindings.HYDRA_CLIENT).toProvider(HydraProvider);
  }

  addComponents() {
    this.component(AuthenticationComponent);
  }

  addExplorer() {
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer'
    });
    this.component(RestExplorerComponent);
  }

  addHome() {
    this.static('/', path.join(__dirname, '../../public'));
  }

  addSequences() {
    this.sequence(MySequence);
  }
}

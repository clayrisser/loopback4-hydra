import {
  RequestBody,
  Response,
  RestBindings,
  get,
  param,
  post,
  requestBody
} from '@loopback/rest';
import { inject } from '@loopback/context';
import axios from 'axios';

export class AuthController {
  constructor(@inject(RestBindings.Http.RESPONSE) private res: Response) {}

  @get('/oauth2/callback')
  callback(): object {
    return {};
  }

  @post('/auth/login')
  login(@requestBody() body: RequestBody): object {
    return body;
  }

  @post('/auth/register')
  register(@requestBody() body: RequestBody): object {
    return body;
  }

  @get('/auth/register')
  async registerStatus(
    @param.query.string('login_challenge') challenge: string
  ): Promise<any> {
    let body: any;
    try {
      const res = await axios.get(
        `http://localhost:4445/oauth2/auth/requests/register/${challenge}`
      );
      body = res.data;
      return this.res.redirect(body.request_url);
    } catch (err) {
      const res = err.response;
      if (res.status !== 404) throw err;
      body = res.data;
    }
    return { challenge, body };
  }

  @get('/auth/login')
  async loginStatus(
    @param.query.string('login_challenge') challenge: string
  ): Promise<any> {
    let body: any = {};
    try {
      let res = await axios.get(
        `http://localhost:4445/oauth2/auth/requests/login/${challenge}`
      );
      body = res.data;
      if (body.skip) {
        res = await axios.put(
          `http://localhost:4445/oauth2/auth/requests/login/${challenge}/accept`,
          {
            subject: body.subject
          }
        );
      }
      res = await axios.put(
        `http://localhost:4445/oauth2/auth/requests/login/${challenge}/accept`,
        {
          subject: 'foo@bar.com',
          remember: true,
          remember_for: 3600
        }
      );
      body = res.data;
      return this.res.redirect(body.redirect_to);
    } catch (err) {
      const res = err.response;
      if (res.status !== 404) throw err;
      body = res.data;
    }
    return { challenge, body };
  }

  @get('/auth/consent')
  async consent(
    @param.query.string('consent_challenge') challenge: string
  ): Promise<any> {
    console.log('challenge', challenge);
    let body: any = {};
    try {
      let res = await axios.get(
        `http://localhost:4445/oauth2/auth/requests/consent/${challenge}`
      );
      body = res.data;
      if (body.skip) {
        res = await axios.put(
          `http://localhost:4445/oauth2/auth/requests/consent/${challenge}/accept`,
          {
            session: {}
          }
        );
      }
      res = await axios.put(
        `http://localhost:4445/oauth2/auth/requests/consent/${challenge}/accept`,
        {
          session: {},
          remember: true,
          remember_for: 3600
        }
      );
      body = res.data;
      return this.res.redirect(body.redirect_to);
    } catch (err) {
      const res = err.response;
      if (res.status !== 404) throw err;
      body = res.data;
    }
    return { challenge, body };
  }
}

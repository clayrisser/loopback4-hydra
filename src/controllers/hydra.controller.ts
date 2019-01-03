import { inject } from '@loopback/context';
import { Response, RestBindings, get, param } from '@loopback/rest';
import { Hydra, HydraBindings } from '../providers';

const { env } = process;
const identityUiBaseUrl = env.IDENTITY_UI_BASE_URL || 'http://localhost:6002';

export class HydraController {
  constructor(
    @inject(RestBindings.Http.RESPONSE) private res: Response,
    @inject(HydraBindings.HYDRA_CLIENT) public hydra: Hydra
  ) {}

  @get('/hydra/login')
  async loginStatus(
    @param.query.string('login_challenge') challenge: string
  ): Promise<any> {
    const loginRequest: any = await this.hydra.getLoginRequest(challenge);
    if (loginRequest.skip) {
      const payload: any = await this.hydra.acceptLoginRequest(challenge, {
        subject: loginRequest.subject
      });
      return this.res.redirect(payload.redirect_to);
    }
    return this.res.redirect(
      `${identityUiBaseUrl}/login?challenge=${challenge}`
    );
  }

  @get('/hydra/consent')
  async consent(
    @param.query.string('consent_challenge') challenge: string
  ): Promise<any> {
    const consentRequest: any = await this.hydra.getConsentRequest(challenge);
    if (consentRequest.skip) {
      const payload: any = await this.hydra.acceptConsentRequest(challenge, {
        session: {}
      });
      return this.res.redirect(payload.redirect_to);
    }
    return this.res.redirect(
      `${identityUiBaseUrl}/consent?challenge=${challenge}`
    );
  }
}

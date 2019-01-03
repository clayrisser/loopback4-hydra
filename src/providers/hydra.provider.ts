import axios from 'axios';
import { BindingKey } from '@loopback/context';
import { Provider } from '@loopback/context';

const { env } = process;
const hydraBaseUrl = env.HYDRA_BASE_URL || 'http://localhost:4445';

export namespace HydraBindings {
  export const HYDRA_CLIENT = BindingKey.create<Hydra>('hydra.client');
}

export class Hydra {
  async getLoginRequest(challenge: string) {
    return await get('login', challenge);
  }

  async acceptLoginRequest(challenge: string, body: object) {
    return await put('login', 'accept', challenge, body);
  }

  async rejectLoginRequest(challenge: string, body: object) {
    return await put('login', 'reject', challenge, body);
  }

  async getConsentRequest(challenge: string) {
    return await get('consent', challenge);
  }

  async acceptConsentRequest(challenge: string, body: object) {
    return await put('consent', 'accept', challenge, body);
  }

  async rejectConsentRequest(challenge: string, body: object) {
    return await put('consent', 'reject', challenge, body);
  }
}

export class HydraProvider implements Provider<Hydra> {
  constructor(public hydra: Hydra = new Hydra()) {}

  value(): Hydra {
    return this.hydra;
  }
}

async function get(flow: string, challenge: string): Promise<object> {
  const res = await axios.get(
    `${hydraBaseUrl}/oauth2/auth/requests/${flow}/${challenge}`
  );
  return res.data;
}

async function put(
  flow: string,
  action: string,
  challenge: string,
  body: object
): Promise<object> {
  const res = await axios.put(
    `${hydraBaseUrl}/oauth2/auth/requests/${flow}/${challenge}/${action}`,
    body
  );
  return res.data;
}

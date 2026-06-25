import {E2eAuthStrategy} from '../app/e2e-auth-strategy';
import {AuthStrategy} from '../app/auth-strategy';

export const environment = {
  production: true
};

export const authStrategyProvider = {provide: AuthStrategy, useClass: E2eAuthStrategy};

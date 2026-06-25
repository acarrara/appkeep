import {GoogleAuthStrategy} from '../app/google-auth-strategy';
import {AuthStrategy} from '../app/auth-strategy';

export const environment = {
  production: true
};

export const authStrategyProvider = {provide: AuthStrategy, useClass: GoogleAuthStrategy};

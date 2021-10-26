import { AWSPartitial } from '../types';

export const authenticationConfig: AWSPartitial = {
  functions: {
    signUp: {
      handler: 'api/auth/handler.signUp',
      memorySize: 128,
      events: [
        {
          http: {
            path: '/signup',
            method: 'post',
            cors: true,
            response: {
              headers: {
                'Access-Control-Allow-Credentials': '*',
              },
            },
          },
        },
      ],
    },

    login: {
      handler: 'api/auth/handler.login',
      memorySize: 128,
      events: [
        {
          http: {
            path: '/login',
            method: 'post',
            cors: true,
          },
        },
      ],
    },
  },
};

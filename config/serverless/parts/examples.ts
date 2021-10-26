import { AWSPartitial } from '../types';

export const examplesConfig: AWSPartitial = {
  provider: {
    httpApi: {
      authorizers: {
        jwtauth: {
          type: 'request',
          enableSimpleResponses: true,
          functionName: 'jwtauth',
          identitySource: 'request.header.Authorization',
        },
      },
    },
  },
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

    galleryGetResponse: {
      handler: 'api/gallery/handler.getGalleryPage',
      memorySize: 128,
      events: [
        {
          http: {
            path: '/gallery',
            method: 'get',
            authorizer: 'jwtauth',
            cors: true,
          },
        },
      ],
    },

    uploadPicture: {
      handler: 'api/gallery/handler.uploadPicture',
      memorySize: 128,
      events: [
        {
          http: {
            path: '/upload',
            method: 'post',
            integration: 'lambda-proxy',
            cors: true,
            authorizer: 'jwtauth',
          },
        },
      ],
    },

    jwtauth: {
      handler: 'api/auth/my_auth.myJWTAuth',
      memorySize: 128,
    },
  },
};

import { AWSPartitial } from '../types';

export const galleryConfig: AWSPartitial = {
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
    getGalleryPicture: {
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

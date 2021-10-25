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
    loginGetResponse: {
      handler: 'api/gallery/login/handler.loginGetRequestHandler',
      memorySize: 128,
      events: [
        {
          http: {
            path: '/login',
            method: 'get',
          },
        },
      ],
    },

    loginPostResponse: {
      handler: 'api/gallery/login/handler.loginPostRequestHandler',
      memorySize: 128,
      events: [
        {
          http: {
            path: '/login',
            method: 'post',
          },
        },
      ],
    },

    galleryGetResponse: {
      handler: 'api/gallery/gallery/handler.getGalleryPage',
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
      handler: 'api/gallery/upload/handler.uploadPicture',
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

    signUpResponse: {
      handler: 'api/gallery/sign_up/handler.signUpHandler',
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

    jwtauth: {
      handler: 'api/auth/my_auth.myJWTAuth',
      memorySize: 128,
    },

    // exampleHttpApiDefaultResponse: {
    //   handler: 'api/http-api/handler.defaultResponse',
    //   memorySize: 128,
    //   events: [
    //     {
    //       httpApi: {
    //         path: '/example/http-api/default-response',
    //         method: 'get',
    //         authorizer: {
    //           name: 'exampleAuthorizer',
    //         },
    //       },
    //     },
    //   ],
    // },
    // exampleHttpApiCustomResponse: {
    //   handler: 'api/http-api/handler.customResponse',
    //   memorySize: 128,
    //   events: [
    //     {
    //       httpApi: {
    //         path: '/example/http-api/custom-response',
    //         method: 'get',
    //       },
    //     },
    //   ],
    // },
    // exampleRestApiDefaultResponse: {
    //     handler: 'api/rest-api/handler.handler',
    //     memorySize: 128,
    //     events: [
    //       {
    //         http: {
    //           path: 'example/rest-api/default-response',
    //           method: 'post',
    //           integration: 'lambda',
    //           cors: true,
    //           authorizer: {
    //             name: 'exampleAuthorizerRestApi',
    //           },
    //           response: {
    //             headers: {
    //               'Access-Control-Allow-Origin': "'*'",
    //               'Content-Type': "'application/json'",
    //             },
    //             template: "$input.json('$')",
    //           },
    //         },
    //       },
    //     ],
    //   },
    // exampleAuthorizerHttpApi: {
    //   handler: 'api/auth/handler.httpApiSimple',
    //   memorySize: 128,
    // },
    //   exampleAuthorizerRestApi: {
    //     handler: 'api/auth/handler.authentication',
    //     memorySize: 128,
    //   },
  },
};

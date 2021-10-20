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
      handler: 'api/my_api/login_handlers.loginGetResponse',
      memorySize: 128,
      events: [
        {
          httpApi: {
            path: '/login',
            method: 'get',
          },
        },
      ],
    },

    loginPostResponse: {
      handler: 'api/my_api/login_handlers.loginPostResponse',
      memorySize: 128,
      events: [
        {
          httpApi: {
            path: '/login',
            method: 'post',
          },
        },
      ],
    },

    galleryGetResponse: {
      handler: 'api/my_api/gallery_handlers.getGallery',
      memorySize: 128,
      events: [
        {
          http: {
            path: '/gallery',
            method: 'get',
            authorizer: 'jwtauth',
          },
        },
      ],
    },

    uploadPicture: {
      handler: 'api/my_api/upload_handler.uploadPicture',
      memorySize: 128,
      events: [
        {
          httpApi: {
            path: '/upload',
            method: 'post',
          },
        },
      ],
    },

    signUpResponse: {
      handler: 'api/my_api/sign_up_handler.signUp',
      memorySize: 128,
      events: [
        {
          httpApi: {
            path: '/signup',
            method: 'post',
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
    exampleAuthorizerHttpApi: {
      handler: 'api/auth/handler.httpApiSimple',
      memorySize: 128,
    },
    //   exampleAuthorizerRestApi: {
    //     handler: 'api/auth/handler.authentication',
    //     memorySize: 128,
    //   },
  },
};

import * as Keychain from 'react-native-keychain';

import constants from './configConstants';

const MEMORY_KEY_PREFIX = '@MyStorage:';
let dataMemory: any = {};

class MyStorage {
  static syncPromise = null;

  static setItem(key: string, value: string): boolean {
    Keychain.setGenericPassword(MEMORY_KEY_PREFIX + key, value);
    dataMemory[key] = value;
    return dataMemory[key];
  }

  static getItem(key: string): boolean {
    return Object.prototype.hasOwnProperty.call(dataMemory, key)
      ? dataMemory[key]
      : undefined;
  }

  static removeItem(key: string): boolean {
    Keychain.resetGenericPassword();
    return delete dataMemory[key];
  }

  static clear(): object {
    dataMemory = {};
    return dataMemory;
  }
}

const authConfig = {
  Auth: {
    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    // identityPoolId: constants.cognito.IDENTITY_POOL_ID,

    // REQUIRED - Amazon Cognito Region
    region: constants.cognito.REGION,

    // OPTIONAL - Amazon Cognito Federated Identity Pool Region
    // Required only if it's different from Amazon Cognito Region
    // identityPoolRegion: 'XX-XXXX-X',

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: constants.cognito.USER_POOL_ID,

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: constants.cognito.USER_POOL_APP_CLIENT_ID,

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: true,

    // OPTIONAL - Configuration for cookie storage
    // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
    // cookieStorage: {
    //     // REQUIRED - Cookie domain (only required if cookieStorage is provided)
    //     domain: '.yourdomain.com',
    //     // OPTIONAL - Cookie path
    //     path: '/',
    //     // OPTIONAL - Cookie expiration in days
    //     expires: 365,
    //     // OPTIONAL - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
    //     sameSite: "strict" | "lax",
    //     // OPTIONAL - Cookie secure flag
    //     // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
    //     secure: true
    // },

    // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    // authenticationFlowType: 'USER_PASSWORD_AUTH',

    // OPTIONAL - Manually set key value pairs that can be passed to Cognito Lambda Triggers
    // clientMetadata: {myCustomKey: 'myCustomValue'},

    // OPTIONAL - Hosted UI configuration
    // oauth: {
    //   domain: 'your_cognito_domain',
    //   scope: [
    //     'phone',
    //     'email',
    //     'profile',
    //     'openid',
    //     'aws.cognito.signin.user.admin',
    //   ],
    //   redirectSignIn: 'http://localhost:3000/',
    //   redirectSignOut: 'http://localhost:3000/',
    //   responseType: 'code', // or 'token', note that REFRESH token will only be generated when the responseType is code
    // },
  },
  API: {
    endpoints: [
      {
        name: 'MyLife',
        endpoint: constants.apiGateway.URL,
        region: constants.apiGateway.REGION,
      },
    ],
  },

  // OPTIONAL - customized storage object
  storage: MyStorage,
};

export default authConfig;

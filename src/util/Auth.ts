import {Auth} from 'aws-amplify';

export const getJwt = async () => {
  try {
    const session = await Auth.currentSession();

    console.log('Tokens');
    console.log(session);

    const accessToken = session.getAccessToken();

    const jwt = accessToken.getJwtToken();

    return jwt;
  } catch (err) {
    console.log(err);

    return undefined;
  }
};

export const getIsLoggedIn = async () => {
  try {
    const user = await Auth.currentAuthenticatedUser();

    console.log(user);

    return !!user;
  } catch (err) {
    console.log(err);

    return undefined;
  }
};

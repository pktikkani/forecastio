import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: "ap-south-1_Q1xbEE0wO",
  ClientId: "6p5d3fflmp7r8a1ribh090749i",
};

export default new CognitoUserPool(poolData);

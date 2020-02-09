import { v1 as appstoreconnectV1 } from 'appstoreconnect'

// https://developer.apple.com/documentation/appstoreconnectapi/generating_tokens_for_api_requests
const privateKey = process.env.APPLE_PRIVATE_KEY || '';
const issuerId = process.env.APPLE_ISSUER_ID || '';
const keyId = process.env.APPLE_KEY_ID || '';

const token = appstoreconnectV1.token(privateKey, issuerId, keyId);

// Initialize the service. Passing the token up-front is optional, but should be done before any API calls are made.
export const API_TOKEN = appstoreconnectV1(token);

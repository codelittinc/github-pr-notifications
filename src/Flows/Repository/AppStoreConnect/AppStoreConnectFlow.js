import { v1 as appstoreconnectV1 } from 'appstoreconnect'
import { API_TOKEN } from "./generateToken";

// TODO - check the response and read app statuses
// Compare to https://developer.apple.com/documentation/appstoreconnectapi/list_builds
appstoreconnectV1
  .testflight
  .listBuilds(API_TOKEN, {})
  .then(builds => console.log(builds))
  .catch(err => console.error(err));

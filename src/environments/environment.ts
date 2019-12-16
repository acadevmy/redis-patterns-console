// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { version } from 'package.json';
​
export const environment = {
  production: false,
  redisServer: 'ws://127.0.0.1:8080',
  githubAppClientId: '',
  accessTokenRequestUrl: '',
  loginFlowStart: 'https://github.com/login/oauth/authorize?client_id=',
  githubEndpoint: 'https://api.github.com/repos/_repo_/contents/_file_',
  redisDocRepo: {
    path: 'antirez/redis-doc',
    json: 'commands.json',
    doc: 'commands/_file.md'
  },
  patternsRepo: {
    path: 'acadevmy/redis-patterns-cookbook',
    json: 'patterns.json'
  },
  cacheableHeaderKey: 'cacheable-request',
  version
};
​
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
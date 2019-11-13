import { version } from 'package.json';

export const environment = {
  production: true,
  redisServer: '', // ADD HERE YOUR WS SERVER URL
  basicAuth: '', // ADD HERE YOUR GITHUB "user:token" to prevent API rate limit
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

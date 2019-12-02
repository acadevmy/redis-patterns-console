export interface GithubContent {
  content: string;
  type: string;
  url: string;
  download_url: string;
  encoding: string;
}

export interface ITokenResponse {
  query: { code: string };
  data: {
    error?: string;
    error_description?: string;
    error_uri?: string;
    access_token?: string;
    token_type?: string;
    scope?: string;
  };
}
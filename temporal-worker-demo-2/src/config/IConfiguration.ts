export interface IConfiguration {
  env: 'production' | 'development' | 'integration' | 'test';
  stage: 'prod' | 'stage' | 'dev' | 'tests';
  openApi: {
    url: string;
  };
  temporal: {
    host: string;
    port: number;
    namespace: string;
    crt: string;
    pem: string;
  };
  slack: {
    secret: string;
    token: string;
    channel: {
      comments: string;
    };
  };
}

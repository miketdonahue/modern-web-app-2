declare module '*.css';
declare module '*.less';

declare namespace NodeJS {
  interface Process {
    browser: boolean;
  }
}

declare module '*.gql' {
  import { DocumentNode } from 'graphql';

  const value: DocumentNode;

  export = value;
}

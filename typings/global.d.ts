declare namespace NodeJS {
  interface Process {
    browser: boolean;
  }
}

declare module '*.gql' {
  import { DocumentNode } from 'graphql';

  const value: {
    [key: string]: DocumentNode;
  };

  export = value;
}

declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.css';
declare module '*.scss';
declare module 'assign-deep';

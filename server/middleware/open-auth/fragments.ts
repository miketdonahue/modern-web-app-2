export const jwtUserFragment = `
  {
    id
    role {
      name
      permissions {
        key
      }
      prohibitedRoutes
    }
  }
`;

export const userAccountFragment = `
  {
    userAccount {
      id
    }
  }
`;

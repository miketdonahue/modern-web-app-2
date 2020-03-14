export const jwtActorFragment = `
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

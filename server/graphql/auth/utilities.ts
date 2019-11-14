/**
 * Transforms the role object's properties
 *
 * @remarks
 * The role permissions and prohibited routes need to be transformed and simplified for better data access
 *
 * @param role - A user role object
 * @returns The transformed role object
 */
export const transformRole = (role): any => {
  const actorRole = role;

  actorRole.permissions = actorRole.permissions.map(
    permission => permission.key
  );

  actorRole.prohibitedRoutes = actorRole.prohibited_routes.paths;

  return actorRole;
};

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
  const userRole = role;

  userRole.permissions = userRole.permissions.map(permission => permission.key);
  userRole.prohibitedRoutes = userRole.prohibitedRoutes.paths;

  return userRole;
};

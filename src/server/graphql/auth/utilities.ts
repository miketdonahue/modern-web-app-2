/**
 * Transforms the role object's properties
 *
 * @remarks
 * The role permissions and prohibited routes need to be transformed and simplified for better data access
 * off the signed token
 *
 * @param role - A actor role object
 * @returns The transformed role object
 */
export const transformRoleForToken = (role): any => {
  const actorRole = { ...role };
  // TODO: move to entities model Role
  return {
    uuid: actorRole.uuid,
    name: actorRole.name,
    permissions: actorRole.permissions.map(
      permission => JSON.parse(permission).key
    ),
    prohibited_routes: actorRole.prohibited_routes.paths,
  };
};

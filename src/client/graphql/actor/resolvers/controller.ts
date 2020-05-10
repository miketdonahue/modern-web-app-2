/**
 * Sets an actor's id
 *
 * @client
 */
const setActorId = async (
  parent: any,
  args: any,
  context: any
): Promise<any> => {
  const { cache } = context;
  const { actorId } = args.input;

  const data = {
    local: { actor: { id: actorId, __typename: 'Actor' }, __typename: 'Local' },
  };

  cache.writeData({ data });
};

export default {
  Mutation: {
    setActorId,
  },
};

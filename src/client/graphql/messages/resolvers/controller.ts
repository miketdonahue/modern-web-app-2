import gql from 'graphql-tag';

/**
 * Sets a message to be read and displayed on a forthcoming page
 *
 * @client
 */
const setMessage = async (
  parent: any,
  args: any,
  context: any
): Promise<any> => {
  const { cache } = context;
  const { key, message } = args.input;

  const query = gql`
    query getMessages {
      local @client {
        messages {
          key
          message
        }
      }
    }
  `;

  const previous = cache.readQuery({ query });
  const newMessage = { key, message, __typename: 'Message' };
  const data = {
    local: {
      messages: [...previous.messages, newMessage],
      __typename: 'Local',
    },
  };

  cache.writeQuery({ query, data });
};

export default {
  Mutation: {
    setMessage,
  },
};

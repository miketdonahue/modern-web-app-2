import React from 'react';
import { Error } from '@modules/api-response';
import { ServerErrors } from '@components/server-error';
import { useGetActorBooks } from '@modules/queries/actor';
import { downloadProduct } from '@modules/data-sources/products';
import { Card, Alert } from '@components/app';
import { AlertError } from '@components/icons';

export const MyBooks = () => {
  const [serverErrors, setServerErrors] = React.useState<Error[]>([]);

  const { data: actorBooks } = useGetActorBooks();

  const downloadBook = async (id: string) => {
    await downloadProduct({ id })
      .then((response) => {
        const link = document.createElement('a');
        link.href = response.data.attributes.url;
        link.setAttribute('download', `${response.data.attributes.filename}`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        setServerErrors(error.response.data.error);
      });
  };

  return (
    <div className="m-8">
      <div className="mb-8">My Books</div>

      {serverErrors.length > 0 && (
        <Alert variant="error" className="mb-4">
          <div className="mr-3">
            <AlertError size={18} />
          </div>
          <Alert.Content>
            <ServerErrors errors={serverErrors} />
          </Alert.Content>
        </Alert>
      )}

      <div className="grid grid-cols-6 gap-x-4">
        {actorBooks?.data.map((book) => {
          return (
            <Card key={book.attributes.id} raised>
              <Card.Image
                src={book.attributes.image_url}
                alt={`${book.attributes.name} Book Cover`}
              />
              <Card.Content>
                <Card.Title>{book.attributes.name}</Card.Title>
                <Card.Body characterLimit={100}>
                  {book.attributes.short_description}
                </Card.Body>
              </Card.Content>
              <Card.Footer>
                <Card.Actions>
                  <button
                    type="button"
                    onClick={() => downloadBook(book.attributes.id)}
                  >
                    Download
                  </button>
                </Card.Actions>
              </Card.Footer>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

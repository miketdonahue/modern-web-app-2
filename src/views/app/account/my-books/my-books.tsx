import React from 'react';
import { Card } from '@components/app';
import { useGetActorBooks } from '@modules/queries/actor';
import { downloadProduct } from '@modules/data-sources/products';

export const MyBooks = () => {
  const { data: actorBooks } = useGetActorBooks();

  const downloadBook = async (id: string) => {
    await downloadProduct({ id }).then((response) => {
      const link = document.createElement('a');
      link.href = response.data.attributes.url;
      link.setAttribute('download', `${response.data.attributes.filename}`);
      document.body.appendChild(link);
      link.click();
    });
  };

  return (
    <div className="m-8">
      <div className="mb-8">My Books</div>

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

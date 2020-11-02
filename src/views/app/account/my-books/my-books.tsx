import React from 'react';
import { Card } from '@components/app';
import { useGetActorBooks } from '@modules/queries/actor';

export const MyBooks = () => {
  const { data: actorBooks } = useGetActorBooks();

  return (
    <div className="m-8">
      <div className="mb-8">My Books</div>

      <div className="grid grid-cols-6 gap-x-4">
        {actorBooks?.data.map((book) => {
          return (
            <Card raised>
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
                  <div>Download</div>
                </Card.Actions>
              </Card.Footer>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

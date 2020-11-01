import React from 'react';
import { Card } from '@components/app';

export const MyBooks = () => {
  return (
    <div className="m-8">
      <div className="mb-8">My Books</div>

      <div className="w-1/6">
        <Card raised>
          <Card.Header>Header</Card.Header>
          <Card.Image
            src="http://localhost:8080/images/products/prod_I8wodC5lQrLOuG.jpg"
            alt="book"
          />
          <Card.Content>
            <Card.Title>Title</Card.Title>
            <Card.Body>Body</Card.Body>
          </Card.Content>
          <Card.Footer>
            <Card.Actions>
              <div>Download</div>
            </Card.Actions>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
};

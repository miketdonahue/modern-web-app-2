import React from 'react';
import { useGetActorBooks } from '@modules/queries/actor';

export const Courses = () => {
  const { data: response, isLoading } = useGetActorBooks();
  const courses = response?.data;

  return (
    <div>
      <div>Courses</div>
      <div className="grid grid-cols-4 gap-4">
        {!isLoading &&
          courses?.map((result) => {
            return (
              <div key={result.attributes.id}>
                <img
                  src={result.attributes.image_url}
                  alt={result.attributes.name}
                  width="100%"
                />
                <div>{result.attributes.name}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

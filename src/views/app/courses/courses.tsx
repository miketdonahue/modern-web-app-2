import React from 'react';
import Link from 'next/link';
import { useGetActorCourses } from '@modules/queries/actor';

export const Courses = () => {
  const { data: response, isLoading } = useGetActorCourses();
  const courses = response?.data;

  return (
    <div>
      <div>Courses</div>
      <div className="grid grid-cols-4 gap-4">
        {!isLoading &&
          courses?.map((result) => (
            <div key={result.attributes.id}>
              <img
                src={result.attributes.image_url}
                alt={result.attributes.name}
                width="100%"
              />

              <Link href={`/app/courses/${result.attributes.slug}`}>
                <a>{result.attributes.name}</a>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

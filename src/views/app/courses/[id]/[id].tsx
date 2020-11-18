import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useGetProductVideos } from '@modules/queries/product-videos';

const Course = () => {
  const router = useRouter();

  const { data: productVideos } = useGetProductVideos(
    {
      productSlug: router.query.id as string,
    },
    {
      enabled: router.query.id,
    }
  );

  return (
    <div>
      <div>Course long form description</div>
      <ul>
        {productVideos?.data.map((result, index) => {
          const [minutes, seconds = '00'] = String(
            result.attributes.length / 100
          ).split('.');

          return (
            <li key={result.attributes.id}>
              {result.meta?.watched && <div>Watched</div>}
              <div>{index + 1}</div>

              <Link href={`/app/lessons/${result.attributes.slug}`}>
                {result.attributes.title}
              </Link>
              <div>{result.attributes.description}</div>
              <div>
                {minutes}:{seconds}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export { Course };

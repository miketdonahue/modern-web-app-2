import React from 'react';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { markdownToHtml } from '@modules/markdown-to-html';
import { useGetProductVideos } from '@modules/queries/product-videos';

type CourseProps = {
  descriptionHtml: string;
};

const Course = ({ descriptionHtml }: CourseProps) => {
  const router = useRouter();

  const { data: productVideos } = useGetProductVideos(
    {
      productSlug: router.query.slug as string,
    },
    {
      enabled: !!router.query.slug,
    }
  );

  return (
    <div>
      <div>Course long form description</div>
      <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
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

const getServerSideProps: GetServerSideProps = async () => {
  const lessonMarkdown = await markdownToHtml(
    'src/views/app/courses/descriptions'
  );

  return {
    props: {
      descriptionHtml: lessonMarkdown,
    },
  };
};

export { Course, getServerSideProps };

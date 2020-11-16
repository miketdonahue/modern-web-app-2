import React from 'react';
import { useRouter } from 'next/router';
import { useVideo } from '@hooks/use-video';
import { useGetProductVideos } from '@modules/queries/product-videos';
import { VideoPlayer } from '@components/app/video-player';
import { Button } from '@components/app';

const Course = () => {
  const router = useRouter();
  const playerRef = React.useRef(null);
  const { isReady: isPlayerReady, setSrc, changeSrc } = useVideo({
    playerRef,
  });

  const { data: productVideos, isLoading } = useGetProductVideos(
    {
      productSlug: router.query.id as string,
    },
    {
      enabled: router.query.id,
      retry: false,
      // onError: (error) => {
      //   const unauthorized = !error.response?.data.error.find(
      //     (e) => e.status === 403
      //   );

      //   return setHasAccess(unauthorized);
      // },
    }
  );

  React.useEffect(() => {
    if (isPlayerReady && !isLoading && productVideos?.data.length) {
      const firstLesson = productVideos.data.find(
        (row) => row.attributes.ordering === 0
      );

      setSrc(firstLesson?.attributes.video_url || '');
    }
  }, [productVideos, isPlayerReady, isLoading]);

  return (
    <div>
      <div>Course</div>
      <div className="w-1/2">
        <VideoPlayer ref={playerRef} />

        <div className="my-4">
          <ul>
            {productVideos?.data.map((result) => {
              return (
                <li key={result.attributes.id}>
                  <Button.Link
                    onClick={() => {
                      changeSrc(result.attributes.video_url);
                    }}
                  >
                    {result.attributes.title}
                  </Button.Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export { Course };

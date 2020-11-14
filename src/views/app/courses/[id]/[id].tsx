import React from 'react';
import { VideoPlayer } from '@components/app/video-player';
import { Button } from '@components/app';

export const Course = () => {
  const [currentSrc, setSrc] = React.useState(
    'https://static.videezy.com/system/resources/previews/000/005/199/original/Bold_Social_Media_Titles.mp4'
  );

  return (
    <div>
      <div>Course</div>
      <div className="w-1/2">
        <VideoPlayer src={currentSrc} />

        <div className="my-4">
          <ul>
            <li>
              <Button.Link
                onClick={() => {
                  setSrc(
                    'https://static.videezy.com/system/resources/previews/000/005/222/original/Tall_Social_Media_Titles.mp4'
                  );
                }}
              >
                Video 1
              </Button.Link>
            </li>
            <li>
              <Button.Link
                onClick={() => {
                  setSrc(
                    'https://static.videezy.com/system/resources/previews/000/005/212/original/Dark_Social_Media_Titles.mp4'
                  );
                }}
              >
                Video 2
              </Button.Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

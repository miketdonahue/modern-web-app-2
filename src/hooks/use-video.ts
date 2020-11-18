import React from 'react';
import Player from 'plyr';

type VideoPlayerProps = {
  playerRef: React.RefObject<HTMLVideoElement>;
  onEnded?: (e: any) => void;
};

type VideoPlayer = {
  isReady: boolean;
  setSrc: (src: string) => void;
  changeSrc: (src: string) => void;
};

export const useVideo = ({
  playerRef,
  onEnded,
}: VideoPlayerProps): VideoPlayer => {
  const [player, setPlayer] = React.useState<any | null>(null);

  const options = {
    controls: [
      'play-large',
      'play',
      'progress',
      'current-time',
      'mute',
      'volume',
      'settings',
      'airplay',
      'fullscreen',
    ],
    volume: 0.75,
    speed: { selected: 1, options: [0.5, 1, 1.5, 2] },
  };

  React.useEffect(() => {
    const videoPlayer = new Player(playerRef.current as HTMLElement, {
      ...options,
    });

    setPlayer(videoPlayer);

    videoPlayer.on('ended', (event: any) => {
      if (onEnded) onEnded(event);
    });

    return () => {
      if (player !== null) {
        player.destroy();
      }
    };
  }, [playerRef]);

  const setSrc = (src: string) => {
    if (player) {
      player.source = {
        type: 'video',
        sources: [
          {
            src,
            type: 'video/mp4',
          },
        ],
      };
    }
  };

  const changeSrc = (src: string) => {
    if (player) {
      player.source = {
        type: 'video',
        sources: [
          {
            src,
            type: 'video/mp4',
          },
        ],
      };
    }
  };

  return { isReady: !!player, setSrc, changeSrc };
};

import React from 'react';
import videojs, { VideoJsPlayerOptions } from 'video.js';
import 'video.js/dist/video-js.css';
import styles from './video-player.module.scss';

type VideoPlayerProps = {
  src: string;
};

export const VideoPlayer = ({ src }: VideoPlayerProps) => {
  const options: VideoJsPlayerOptions = {
    autoplay: true,
    controls: true,
    fluid: true,
    preload: 'auto',
    poster: '',
    inactivityTimeout: 1000,
    playbackRates: [0.5, 1, 1.5, 2],
    children: [
      'mediaLoader',
      'posterImage',
      'textTrackDisplay',
      'bigPlayButton',
      'loadingSpinner',
      'errorDisplay',
      'textTrackSettings',
      'resizeManager',
      {
        name: 'controlBar',
        children: [
          'playToggle',
          'volumePanel',
          'currentTimeDisplay',
          'timeDivider',
          'durationDisplay',
          'progressControl',
          'liveDisplay',
          'seekToLive',
          'remainingTimeDisplay',
          'customControlSpacer',
          'playbackRateMenuButton',
          'chaptersButton',
          'descriptionsButton',
          'audioTrackButton',
          'fullscreenToggle',
        ],
      },
    ],
    html5: {
      hls: {
        enableLowInitialPlaylist: true,
        smoothQualityChange: true,
        overrideNative: true,
      },
    },
  };

  const videoRef = React.useRef(null);
  const [player, setPlayer] = React.useState<videojs.Player | null>(null);

  React.useEffect(() => {
    const vjsPlayer = videojs(videoRef.current, {
      ...options,
    });

    setPlayer(vjsPlayer);

    return () => {
      if (player !== null) {
        player.dispose();
      }
    };
  }, []);

  React.useEffect(() => {
    if (src && player !== null) {
      player.src({
        src,
        type: 'video/mp4',
      });
    }
  }, [src, player]);

  return (
    <div className={styles.videoPlayer}>
      <video id="video" ref={videoRef} className="video-js" autoPlay>
        <track kind="captions" />
      </video>
    </div>
  );
};
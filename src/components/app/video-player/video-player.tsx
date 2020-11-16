import React from 'react';
import 'plyr/dist/plyr.css';
import styles from './video-player.module.scss';

export const VideoPlayer = React.forwardRef<HTMLVideoElement, {}>(
  (_props, ref) => {
    return (
      <div className={styles.videoPlayer}>
        <video id="video" ref={ref} className="video-js">
          <track kind="captions" />
        </video>
      </div>
    );
  }
);

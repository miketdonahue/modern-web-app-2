import React from 'react';

type SocialSharingProps = {
  twitter: {
    urlToShare?: string;
    title: string;
  };
  facebook: {
    urlToShare?: string;
    title: string;
  };
  windowOptions?: {
    width?: number;
    height?: number;
  };
};

export const SocialSharing = (props: SocialSharingProps) => {
  const width = props.windowOptions?.width || 500;
  const height = props.windowOptions?.height || 450;
  const left = window.innerWidth / 2 - width / 2;
  const top = window.innerHeight / 2 - height / 2;

  const getTwitterUrl = () => {
    return `https://twitter.com/intent/tweet?url=${
      props.twitter.urlToShare || window.location.href
    }&text=${encodeURIComponent(props.twitter.title)}`;
  };

  const getFacebookUrl = () => {
    return `https://www.facebook.com/sharer/sharer.php?u=${
      props.facebook.urlToShare || window.location.href
    }&title=${encodeURIComponent(props.facebook.title)}`;
  };

  const windowOptions = `resizable,scrollbars,status,height=${height},width=${width},left=${left},top=${top}`;

  return (
    <div className="space-x-3">
      <a
        href={getTwitterUrl()}
        onClick={(e) => {
          e.preventDefault();

          const shareWindow = window.open(
            getTwitterUrl(),
            undefined,
            windowOptions
          );

          if (shareWindow) {
            shareWindow.opener = null;
          }
        }}
      >
        Twitter
      </a>

      <a
        href={getFacebookUrl()}
        onClick={(e) => {
          e.preventDefault();

          const shareWindow = window.open(
            getFacebookUrl(),
            undefined,
            windowOptions
          );

          if (shareWindow) {
            shareWindow.opener = null;
          }
        }}
      >
        Facebook
      </a>
    </div>
  );
};

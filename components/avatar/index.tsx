import React from 'react';
import cx from 'classnames';
import classes from './styles.css';

interface Props {
  size?: 'default' | 'small' | 'large';
  shape?: 'circle' | 'square';
  src?: string;
  alt?: string;
  children?: any;
  [key: string]: any;
}

const Avatar = ({
  size = 'default',
  shape = 'circle',
  src = '',
  alt = 'Image',
  children = null,
  ...restOfProps
}: Props) => {
  let content = children;
  const avatarClasses = cx(classes.avatar, {
    [classes['avatar-background']]: !src,
    [classes['avatar-default']]: size === 'default',
    [classes['avatar-sm']]: size === 'small',
    [classes['avatar-lg']]: size === 'large',
    [classes['avatar-shape-square']]: shape === 'square',
  });

  if (src) content = <img src={src} alt={alt} />;

  return (
    <div {...restOfProps} className={avatarClasses} style={restOfProps.style}>
      {content}
    </div>
  );
};

export { Avatar };

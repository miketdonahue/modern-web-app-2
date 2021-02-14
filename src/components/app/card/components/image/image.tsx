import React from 'react';
import cx from 'classnames';
import { CardContext } from '../../card-context';
import styles from './image.module.scss';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt: string;
  className?: string;
}

const Image = ({ alt, className, ...restOfProps }: ImageProps) => (
  <CardContext.Consumer>
    {() => {
      const imageClasses = cx(styles.image, {}, className);

      return <img alt={alt} className={imageClasses} {...restOfProps} />;
    }}
  </CardContext.Consumer>
);

export { Image };

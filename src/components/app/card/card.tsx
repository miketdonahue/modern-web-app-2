import React from 'react';
import cx from 'classnames';
import { CardContext } from './card-context';
import { Header } from './components/header';
import { Image } from './components/image';
import { Title } from './components/title';
import { Content } from './components/content';
import { Body } from './components/body';
import { Footer } from './components/footer';
import { Actions } from './components/actions';
import styles from './card.module.scss';

interface Card extends React.HTMLAttributes<HTMLDivElement> {
  raised?: boolean;
  children: string | React.ReactNode;
  className?: string;
}

const Card = ({ raised, children, className, ...restOfProps }: Card) => {
  const cardClasses = cx(
    styles.card,
    {
      [styles.raised]: raised,
    },
    className
  );

  return (
    <CardContext.Provider value={{}}>
      <div className={cardClasses} {...restOfProps}>
        <>{children}</>
      </div>
    </CardContext.Provider>
  );
};

// Sub-components
Card.Header = Header;
Card.Image = Image;
Card.Title = Title;
Card.Content = Content;
Card.Body = Body;
Card.Footer = Footer;
Card.Actions = Actions;

export { Card };

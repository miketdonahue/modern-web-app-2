import React from 'react';

/**
 * A React component to display server errors
 *
 * @param props - React component props
 * @param props.errors - A list of errors
 * @returns A React component
 */
const ServerErrors = ({ errors }: any) => {
  return (
    <div>
      {errors.map((error: any) => {
        return <div>{error.message}</div>;
      })}
    </div>
  );
};

export { ServerErrors };

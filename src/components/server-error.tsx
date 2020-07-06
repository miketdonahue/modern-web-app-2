import React from 'react';

/**
 * A React component to display server errors
 */
const ServerErrors = ({ errors }: any) => {
  return (
    <div>
      {errors.map((error: any) => {
        return <div key={error.code}>{error.detail}</div>;
      })}
    </div>
  );
};

export { ServerErrors };

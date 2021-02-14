import React from 'react';

/**
 * A React component to display server errors
 */
const ServerErrors = ({ errors }: any) => (
  <div>
    {errors.map((error: any) => (
      <div key={error.code}>{error.detail}</div>
    ))}
  </div>
);

export { ServerErrors };

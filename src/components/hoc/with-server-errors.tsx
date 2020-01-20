import React, { Component } from 'react';
import errorMap from 'src/client/modules/errors/map';

interface State {
  errors: string[];
}

interface Error {
  code?: string;
  message?: string;
}

/**
 * Attach server errors to a React component
 *
 * @remarks
 * This is a higher-order React component
 *
 * @param WrappedComponent - The wrapped React component
 * @returns Renders a new component wrapped with Apollo Client
 */
const withServerErrors = (WrappedComponent): any => {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

  return class WithServerErrors extends Component<{}, State> {
    public static displayName = `WithServerErrors(${displayName})`;
    public state = {
      errors: [],
    };

    public formatServerErrors = errors => {
      const formattedErrors = errors.map(e => {
        const obj: Error = {};
        const { code } = e.extensions;
        const msg = errorMap[code];

        obj.code = code;
        obj.message = msg;

        return obj;
      });

      this.setState(prevState => ({
        errors: [...prevState.errors, ...formattedErrors],
      }));
    };

    public render(): any {
      const { errors } = this.state;

      return (
        <WrappedComponent
          {...this.props}
          formatServerErrors={this.formatServerErrors}
          serverErrors={errors}
        />
      );
    }
  };
};

export default withServerErrors;

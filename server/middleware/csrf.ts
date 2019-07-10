import csurf from 'csurf';

/**
 * CSRF protection
 *
 * @remarks
 * This is an Express.js middleware
 *
 * @param config - csurf package configuration
 * @param config.ignoreUrls - A set of URLs to ignore CSRF protection
 * @param req - Express.js request object
 * @param res - Express.js response object
 * @param next - Express.js next method
 * @returns An Express.js middleware
 */
const csrf = (config): any => {
  const { ignoreUrls, ...options } = config;
  const csrfProtection = csurf({ ...options });

  return (req, res, next) => {
    if (ignoreUrls.includes(req.url)) return next();

    return csrfProtection(req, res, next);
  };
};

export default csrf;

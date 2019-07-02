import logger from '@server/modules/logger';

/**
 * Logs Express.js request metadata
 *
 * @remarks
 * This is an Express.js middleware
 *
 * @param req - Express.js request object
 * @param res - Express.js response object
 * @param next - Express.js next method
 * @returns An Express.js middleware
 */
const requestLogger = (): any => {
  return (req, res, next) => {
    if (req.url.startsWith('/_next')) return next();

    const startTime = process.hrtime();
    const originalResEnd = res.end;

    logger.info(
      {
        req,
        res,
      },
      'Start request'
    );

    res.end = (...args) => {
      const diffTime = process.hrtime(startTime);
      const responseTime = (diffTime[0] * 1e9 + diffTime[1]) / 1e6;

      logger.info(
        {
          responseTime: `${responseTime} ms`,
        },
        'End request'
      );

      originalResEnd.apply(res, args);
    };

    return next();
  };
};

export default requestLogger;

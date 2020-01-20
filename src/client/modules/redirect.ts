import Router from 'next/router';

/**
 * Redirection
 *
 * @remarks
 * This is a universal function that will take appropriate actions on the browser and server
 *
 * @param ctx - Next.js context
 * @param url - Current URL
 * @returns Redirects to the given URL
 */
export const redirectTo = (ctx, url): any => {
  if (ctx.res) {
    ctx.res.writeHead(302, { Location: url });
    return ctx.res.end();
  }

  return Router.replace(url);
};

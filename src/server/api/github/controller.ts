import { Request, Response, NextFunction } from 'express';
import { ApiResponseWithData } from '@modules/api-response';
import { request } from '@modules/request';
import { errorTypes } from '@server/modules/errors';

/**
 * Get code from a Github file given a file slug
 */
const getGithubCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { filename } = req.query;

  try {
    const result = await request.get(
      `https://raw.githubusercontent.com/Zero-to-Sixty-JavaScript/zero-to-sixty-javascript/master/${filename}`,
      {
        headers: {
          authorization: process.env.GITHUB,
          accept: 'application/vnd.github.v3+json',
        },
      }
    );

    const resultWithoutTrailingLine =
      result.data[result.data.length - 1] === '\n'
        ? result.data.slice(0, result.data.length - 1)
        : result.data;

    const response: ApiResponseWithData<{ code: string }> = {
      data: { attributes: { code: resultWithoutTrailingLine } },
    };

    return res.json(response);
  } catch (error) {
    return next({
      status: errorTypes.GITHUB_CODE_NOT_FOUND.status,
      code: errorTypes.GITHUB_CODE_NOT_FOUND.code,
      detail: errorTypes.GITHUB_CODE_NOT_FOUND.detail,
    });
  }
};

export { getGithubCode };

import { createMocks, RequestMethod } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';

describe('should return a status code of 200', () => {
  function mockRequestResponse(method: RequestMethod = 'POST') {
    const {
      req,
      res,
    }: { req: NextApiRequest; res: NextApiResponse } = createMocks({ method });
    req.headers = {
      'Content-Type': 'application/json',
    };
    req.query = { '../src/app/api/fileUnload/route.ts' };
    return { req, res };
  }
})
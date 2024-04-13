import NextAuth from "next-auth";

import { authOptions } from "@/server/auth";
import { NextApiRequest, NextApiResponse } from "next";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

export async function handler(req: NextApiRequest, res: NextApiResponse) {

  // @ts-ignore
  const host = req.headers.get('host');
  const urls = host.split('.');
  const iceoCode = urls.length > 1 ? urls[0] : 'test1';
  console.log('iceoCode: --> ', { host,urls,iceoCode });
  process.env['NEXTAUTH_URL'] = `https://${iceoCode}.localhost:3000`;

  return await NextAuth(req, res, authOptions({ iceoCode: iceoCode }))
}

export { handler as GET, handler as POST };

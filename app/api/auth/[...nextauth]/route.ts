import NextAuth from 'next-auth';
import { getAuthOptions } from '@/lib/auth-options';

const handler = async (req: any, res: any) => {
  return NextAuth(getAuthOptions())(req, res);
};

export { handler as GET, handler as POST };

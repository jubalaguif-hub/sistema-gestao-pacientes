import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { authenticateFirebaseUser } from "../firebaseAuth";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  // Extrair token Firebase do header Authorization
  const authHeader = opts.req.headers.authorization;
  console.log('[Context] Authorization header:', authHeader ? 'present' : 'missing');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    console.log('[Context] Token length:', token.length);
    try {
      user = await authenticateFirebaseUser(token);
      console.log('[Context] User authenticated:', user ? user.email : 'null');
    } catch (error) {
      // Authentication is optional for public procedures.
      console.error('[Context] Authentication error:', error);
      user = null;
    }
  } else {
    console.log('[Context] No Bearer token found');
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}

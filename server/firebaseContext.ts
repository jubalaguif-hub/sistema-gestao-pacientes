import { Request, Response } from "express";
import { User } from "../drizzle/schema";
import { authenticateFirebaseUser } from "./firebaseAuth";

export type FirebaseContext = {
  req: Request;
  res: Response;
  user: User | null;
};

export async function createFirebaseContext({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<FirebaseContext> {
  let user: User | null = null;

  // Extrair token do header Authorization
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      user = await authenticateFirebaseUser(token);
    } catch (error) {
      console.error('[Firebase Context] Authentication failed:', error);
    }
  }

  return {
    req,
    res,
    user,
  };
}

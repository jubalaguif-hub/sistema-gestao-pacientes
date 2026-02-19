import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { pacientesRouter } from "./routers/pacientes";
import { pendenciasRouter } from "./routers/pendencias";
import { adminRouter } from "./routers/admin";

// Procedure protegido que requer autenticação Firebase
const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Autenticação necessária" });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

// Procedure exclusivo para administradores
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Acesso restrito a administradores" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    // Retorna informações do usuário autenticado
    me: publicProcedure.query(({ ctx }) => ctx.user),
    
    // Logout (Firebase gerencia no cliente)
    logout: publicProcedure.mutation(() => {
      return { success: true };
    }),
    
    // Atualizar prédio e turno do usuário no login
    updateLoginInfo: protectedProcedure
      .input(z.object({
        predio: z.enum(["UPA", "HOB"]),
        turno: z.enum(["Diurno", "Noturno"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        
        const { users } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        await db.update(users)
          .set({
            predio: input.predio,
            turno: input.turno,
          })
          .where(eq(users.id, ctx.user.id));
        
        return { success: true };
      }),
  }),

  pacientes: pacientesRouter,
  pendencias: pendenciasRouter,
  admin: adminRouter,
  // TODO: Adicionar routers de notificações
});

export type AppRouter = typeof appRouter;

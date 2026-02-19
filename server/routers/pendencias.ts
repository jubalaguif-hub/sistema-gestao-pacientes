import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { pendencias, pacientes, InsertPendencia } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export const pendenciasRouter = router({
  // Listar pendências ativas do usuário
  listAtivas: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      try {
        const result = await db
          .select({
            pendencia: pendencias,
            paciente: pacientes,
          })
          .from(pendencias)
          .innerJoin(pacientes, eq(pendencias.pacienteId, pacientes.id))
          .where(
            and(
              eq(pendencias.status, "pendente"),
              eq(pacientes.predio, ctx.user.predio as "UPA" | "HOB"),
              eq(pacientes.turno, ctx.user.turno as "Diurno" | "Noturno"),
              eq(pacientes.status, "ativo")
            )
          );

        return result;
      } catch (error) {
        console.error("Erro ao listar pendências:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  // Marcar pendência como resolvida
  markResolved: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      try {
        await db
          .update(pendencias)
          .set({
            status: "resolvida",
            horaResolucao: new Date(),
            resolvidoPorId: ctx.user.id,
          })
          .where(eq(pendencias.id, input));

        // Verificar se todas as pendências do paciente foram resolvidas
        const pend = await db
          .select()
          .from(pendencias)
          .where(eq(pendencias.id, input))
          .limit(1);

        if (pend.length > 0) {
          const pacienteId = pend[0].pacienteId;
          const pendenciasRestantes = await db
            .select()
            .from(pendencias)
            .where(
              and(
                eq(pendencias.pacienteId, pacienteId),
                eq(pendencias.status, "pendente")
              )
            );

          // Se não há mais pendências, marcar paciente como resolvido
          if (pendenciasRestantes.length === 0) {
            await db
              .update(pacientes)
              .set({
                status: "resolvido",
                horaResolucao: new Date(),
              })
              .where(eq(pacientes.id, pacienteId));
          }
        }

        return { success: true };
      } catch (error) {
        console.error("Erro ao marcar pendência como resolvida:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  // Criar nova pendência para um paciente
  create: protectedProcedure
    .input(z.object({
      pacienteId: z.number(),
      tipoPendencia: z.enum(["Raio X", "TC", "Lab", "Reavaliação", "1ª Avaliação", "Outros"]),
      descricao: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      try {
        const pendenciaData: InsertPendencia = {
          pacienteId: input.pacienteId,
          tipoPendencia: input.tipoPendencia,
          descricao: input.descricao || null,
          status: "pendente",
          criadoPorId: ctx.user.id,
          horaCriacao: new Date(),
        };

        const result = await db.insert(pendencias).values(pendenciaData);

        return { success: true, pendenciaId: result[0].insertId };
      } catch (error) {
        console.error("Erro ao criar pendência:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  // Obter histórico de pendências (para admin)
  getHistorico: protectedProcedure
    .input(z.object({
      dataInicio: z.date().optional(),
      dataFim: z.date().optional(),
      predio: z.enum(["UPA", "HOB"]).optional(),
      turno: z.enum(["Diurno", "Noturno"]).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Apenas admins podem acessar histórico completo
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Acesso restrito a administradores" });
      }

      try {
        // Aplicar filtros
        const conditions = [];

        if (input.predio) {
          conditions.push(eq(pacientes.predio, input.predio));
        }

        if (input.turno) {
          conditions.push(eq(pacientes.turno, input.turno));
        }

        const whereCondition = conditions.length > 0 ? and(...conditions) : undefined;

        const result = await db
          .select({
            pendencia: pendencias,
            paciente: pacientes,
          })
          .from(pendencias)
          .innerJoin(pacientes, eq(pendencias.pacienteId, pacientes.id))
          .where(whereCondition || eq(pendencias.id, -1)); // Dummy condition if no filters
        return result;
      } catch (error) {
        console.error("Erro ao obter histórico:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
});

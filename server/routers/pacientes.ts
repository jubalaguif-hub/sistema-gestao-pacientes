import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { pacientes, pendencias, InsertPaciente, InsertPendencia } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export const pacientesRouter = router({
  // Criar novo paciente
  create: protectedProcedure
    .input(z.object({
      nome: z.string().min(1, "Nome é obrigatório"),
      idade: z.number().int().positive("Idade deve ser um número positivo"),
      especialidade: z.string().min(1, "Especialidade é obrigatória"),
      temPendencia: z.boolean(),
      localPaciente: z.string().min(1, "Local do paciente é obrigatório"),
      outrasAcoes: z.string().optional(),
      pendencias: z.array(z.object({
        tipo: z.enum(["Raio X", "TC", "Lab", "Reavaliação", "1ª Avaliação", "Outros"]),
        descricao: z.string().optional(),
      })).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      try {
        // Criar paciente
        const pacienteData: InsertPaciente = {
          nome: input.nome,
          idade: input.idade,
          especialidade: input.especialidade,
          temPendencia: input.temPendencia,
          localPaciente: input.localPaciente,
          outrasAcoes: input.outrasAcoes || null,
          predio: ctx.user.predio as "UPA" | "HOB",
          turno: ctx.user.turno as "Diurno" | "Noturno",
          cadastradoPorId: ctx.user.id,
          horaCadastro: new Date(),
          status: "ativo",
        };

        const result = await db.insert(pacientes).values(pacienteData);
        const pacienteId = result[0].insertId;

        // Criar pendências se houver
        if (input.temPendencia && input.pendencias && input.pendencias.length > 0) {
          for (const pend of input.pendencias) {
            const pendenciaData: InsertPendencia = {
              pacienteId,
              tipoPendencia: pend.tipo,
              descricao: pend.descricao || null,
              status: "pendente",
              criadoPorId: ctx.user.id,
              horaCriacao: new Date(),
            };
            await db.insert(pendencias).values(pendenciaData);
          }
        }

        return { success: true, pacienteId };
      } catch (error) {
        console.error("Erro ao criar paciente:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erro ao criar paciente" });
      }
    }),

  // Listar pacientes do turno/prédio atual
  list: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      try {
        const result = await db
          .select()
          .from(pacientes)
          .where(
            and(
              eq(pacientes.predio, ctx.user.predio as "UPA" | "HOB"),
              eq(pacientes.turno, ctx.user.turno as "Diurno" | "Noturno"),
              eq(pacientes.status, "ativo")
            )
          );

        return result;
      } catch (error) {
        console.error("Erro ao listar pacientes:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  // Obter detalhes de um paciente
  getById: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      try {
        const paciente = await db
          .select()
          .from(pacientes)
          .where(eq(pacientes.id, input))
          .limit(1);

        if (!paciente.length) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Paciente não encontrado" });
        }

        const pends = await db
          .select()
          .from(pendencias)
          .where(eq(pendencias.pacienteId, input));

        return { ...paciente[0], pendencias: pends };
      } catch (error) {
        console.error("Erro ao obter paciente:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  // Marcar paciente como resolvido
  markResolved: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      try {
        await db
          .update(pacientes)
          .set({
            status: "resolvido",
            horaResolucao: new Date(),
          })
          .where(eq(pacientes.id, input));

        return { success: true };
      } catch (error) {
        console.error("Erro ao marcar paciente como resolvido:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
});

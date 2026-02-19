import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { pacientes, pendencias, users } from "../../drizzle/schema";
import { eq, and, gte, lte } from "drizzle-orm";

// Admin procedure - apenas administradores
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user?.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Acesso restrito a administradores" });
  }
  return next({ ctx });
});

export const adminRouter = router({
  // Obter todos os pacientes com filtros
  getPacientes: adminProcedure
    .input(z.object({
      predio: z.enum(["UPA", "HOB"]).optional(),
      turno: z.enum(["Diurno", "Noturno"]).optional(),
      dataInicio: z.date().optional(),
      dataFim: z.date().optional(),
      funcionarioId: z.number().optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      try {
        const conditions = [];

        if (input.predio) {
          conditions.push(eq(pacientes.predio, input.predio));
        }

        if (input.turno) {
          conditions.push(eq(pacientes.turno, input.turno));
        }

        if (input.funcionarioId) {
          conditions.push(eq(pacientes.cadastradoPorId, input.funcionarioId));
        }

        if (input.dataInicio) {
          conditions.push(gte(pacientes.horaCadastro, input.dataInicio));
        }

        if (input.dataFim) {
          conditions.push(lte(pacientes.horaCadastro, input.dataFim));
        }

        const whereCondition = conditions.length > 0 ? and(...conditions) : undefined;

        const result = await db
          .select({
            paciente: pacientes,
            funcionario: users,
          })
          .from(pacientes)
          .innerJoin(users, eq(pacientes.cadastradoPorId, users.id))
          .where(whereCondition || eq(pacientes.id, -1));
        return result;
      } catch (error) {
        console.error("Erro ao obter pacientes:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  // Obter histórico completo de pendências
  getPendencias: adminProcedure
    .input(z.object({
      predio: z.enum(["UPA", "HOB"]).optional(),
      turno: z.enum(["Diurno", "Noturno"]).optional(),
      dataInicio: z.date().optional(),
      dataFim: z.date().optional(),
      status: z.enum(["pendente", "resolvida"]).optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      try {
        const conditions = [];

        if (input.status) {
          conditions.push(eq(pendencias.status, input.status));
        }

        if (input.predio) {
          conditions.push(eq(pacientes.predio, input.predio));
        }

        if (input.turno) {
          conditions.push(eq(pacientes.turno, input.turno));
        }

        if (input.dataInicio) {
          conditions.push(gte(pendencias.horaCriacao, input.dataInicio));
        }

        if (input.dataFim) {
          conditions.push(lte(pendencias.horaCriacao, input.dataFim));
        }

        const whereCondition = conditions.length > 0 ? and(...conditions) : undefined;

        const result = await db
          .select({
            pendencia: pendencias,
            paciente: pacientes,
            criadoPor: users,
          })
          .from(pendencias)
          .innerJoin(pacientes, eq(pendencias.pacienteId, pacientes.id))
          .innerJoin(users, eq(pendencias.criadoPorId, users.id))
          .where(whereCondition || eq(pendencias.id, -1));
        return result;
      } catch (error) {
        console.error("Erro ao obter pendências:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  // Obter estatísticas
  getEstatisticas: adminProcedure
    .input(z.object({
      dataInicio: z.date().optional(),
      dataFim: z.date().optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      try {
        // Total de pacientes
        const totalPacientes = await db.select().from(pacientes);

        // Pacientes resolvidos
        const pacientesResolvidos = totalPacientes.filter(p => p.status === "resolvido");

        // Pendências resolvidas
        const todasPendencias = await db.select().from(pendencias);
        const pendenciasResolvidas = todasPendencias.filter(p => p.status === "resolvida");

        // Tempo médio de resolução
        let tempoMedioResolucao = 0;
        const pendenciasComResolucao = todasPendencias.filter(
          p => p.status === "resolvida" && p.horaResolucao
        );

        if (pendenciasComResolucao.length > 0) {
          const tempos = pendenciasComResolucao.map(p => {
            const inicio = p.horaCriacao.getTime();
            const fim = p.horaResolucao!.getTime();
            return (fim - inicio) / (1000 * 60); // em minutos
          });
          tempoMedioResolucao = tempos.reduce((a, b) => a + b, 0) / tempos.length;
        }

        return {
          totalPacientes: totalPacientes.length,
          pacientesResolvidos: pacientesResolvidos.length,
          totalPendencias: todasPendencias.length,
          pendenciasResolvidas: pendenciasResolvidas.length,
          tempoMedioResolucaoMinutos: Math.round(tempoMedioResolucao),
        };
      } catch (error) {
        console.error("Erro ao obter estatísticas:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  // Listar funcionários
  getFuncionarios: adminProcedure
    .query(async () => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      try {
        const result = await db
          .select()
          .from(users)
          .where(eq(users.role, "funcionario"));

        return result;
      } catch (error) {
        console.error("Erro ao obter funcionários:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  // Gerar relatório de pendências
  gerarRelatorio: adminProcedure
    .input(z.object({
      dataInicio: z.date(),
      dataFim: z.date(),
      predio: z.enum(["UPA", "HOB"]).optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      try {
        const conditions = [
          gte(pendencias.horaCriacao, input.dataInicio),
          lte(pendencias.horaCriacao, input.dataFim),
        ];

        if (input.predio) {
          conditions.push(eq(pacientes.predio, input.predio));
        }

        const result = await db
          .select({
            pendencia: pendencias,
            paciente: pacientes,
            funcionario: users,
          })
          .from(pendencias)
          .innerJoin(pacientes, eq(pendencias.pacienteId, pacientes.id))
          .innerJoin(users, eq(pendencias.criadoPorId, users.id))
          .where(and(...conditions));

        return result;
      } catch (error) {
        console.error("Erro ao gerar relatório:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
});

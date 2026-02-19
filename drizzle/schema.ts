import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, bigint } from "drizzle-orm/mysql-core";

/**
 * Tabela de usuários com autenticação Firebase
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  firebaseUid: varchar("firebaseUid", { length: 128 }).notNull().unique(),
  email: varchar("email", { length: 320 }).notNull(),
  name: text("name").notNull(),
  role: mysqlEnum("role", ["funcionario", "admin"]).default("funcionario").notNull(),
  predio: mysqlEnum("predio", ["UPA", "HOB"]),
  turno: mysqlEnum("turno", ["Diurno", "Noturno"]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

/**
 * Tabela de pacientes
 */
export const pacientes = mysqlTable("pacientes", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  idade: int("idade").notNull(),
  especialidade: varchar("especialidade", { length: 255 }).notNull(),
  temPendencia: boolean("temPendencia").default(false).notNull(),
  localPaciente: text("localPaciente").notNull(),
  outrasAcoes: text("outrasAcoes"),
  predio: mysqlEnum("predio", ["UPA", "HOB"]).notNull(),
  turno: mysqlEnum("turno", ["Diurno", "Noturno"]).notNull(),
  cadastradoPorId: int("cadastradoPorId").notNull(),
  horaCadastro: timestamp("horaCadastro").defaultNow().notNull(),
  horaResolucao: timestamp("horaResolucao"),
  status: mysqlEnum("status", ["ativo", "resolvido", "arquivado"]).default("ativo").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Tabela de pendências dos pacientes
 */
export const pendencias = mysqlTable("pendencias", {
  id: int("id").autoincrement().primaryKey(),
  pacienteId: int("pacienteId").notNull(),
  tipoPendencia: mysqlEnum("tipoPendencia", [
    "Raio X",
    "TC",
    "Lab",
    "Reavaliação",
    "1ª Avaliação",
    "Outros"
  ]).notNull(),
  descricao: text("descricao"),
  status: mysqlEnum("status", ["pendente", "resolvida"]).default("pendente").notNull(),
  criadoPorId: int("criadoPorId").notNull(),
  horaCriacao: timestamp("horaCriacao").defaultNow().notNull(),
  horaResolucao: timestamp("horaResolucao"),
  resolvidoPorId: int("resolvidoPorId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Tabela de configurações de notificações por usuário
 */
export const notificacoesConfig = mysqlTable("notificacoesConfig", {
  id: int("id").autoincrement().primaryKey(),
  usuarioId: int("usuarioId").notNull().unique(),
  intervaloMinutos: int("intervaloMinutos").default(30).notNull(),
  notificacaoVisual: boolean("notificacaoVisual").default(true).notNull(),
  notificacaoSonora: boolean("notificacaoSonora").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Tabela de histórico de ações para auditoria LGPD
 */
export const historicoAcoes = mysqlTable("historicoAcoes", {
  id: int("id").autoincrement().primaryKey(),
  usuarioId: int("usuarioId").notNull(),
  acao: varchar("acao", { length: 255 }).notNull(),
  entidade: varchar("entidade", { length: 100 }).notNull(),
  entidadeId: int("entidadeId"),
  detalhes: text("detalhes"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

/**
 * Tabela de consentimento LGPD
 */
export const consentimentoLGPD = mysqlTable("consentimentoLGPD", {
  id: int("id").autoincrement().primaryKey(),
  usuarioId: int("usuarioId").notNull().unique(),
  aceitouTermos: boolean("aceitouTermos").default(false).notNull(),
  aceitouPrivacidade: boolean("aceitouPrivacidade").default(false).notNull(),
  dataConsentimento: timestamp("dataConsentimento").defaultNow().notNull(),
  ipAddress: varchar("ipAddress", { length: 45 }),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Paciente = typeof pacientes.$inferSelect;
export type InsertPaciente = typeof pacientes.$inferInsert;
export type Pendencia = typeof pendencias.$inferSelect;
export type InsertPendencia = typeof pendencias.$inferInsert;
export type NotificacaoConfig = typeof notificacoesConfig.$inferSelect;
export type InsertNotificacaoConfig = typeof notificacoesConfig.$inferInsert;
export type HistoricoAcao = typeof historicoAcoes.$inferSelect;
export type InsertHistoricoAcao = typeof historicoAcoes.$inferInsert;
export type ConsentimentoLGPD = typeof consentimentoLGPD.$inferSelect;
export type InsertConsentimentoLGPD = typeof consentimentoLGPD.$inferInsert;

CREATE TABLE `consentimentoLGPD` (
	`id` int AUTO_INCREMENT NOT NULL,
	`usuarioId` int NOT NULL,
	`aceitouTermos` boolean NOT NULL DEFAULT false,
	`aceitouPrivacidade` boolean NOT NULL DEFAULT false,
	`dataConsentimento` timestamp NOT NULL DEFAULT (now()),
	`ipAddress` varchar(45),
	CONSTRAINT `consentimentoLGPD_id` PRIMARY KEY(`id`),
	CONSTRAINT `consentimentoLGPD_usuarioId_unique` UNIQUE(`usuarioId`)
);
--> statement-breakpoint
CREATE TABLE `historicoAcoes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`usuarioId` int NOT NULL,
	`acao` varchar(255) NOT NULL,
	`entidade` varchar(100) NOT NULL,
	`entidadeId` int,
	`detalhes` text,
	`ipAddress` varchar(45),
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `historicoAcoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notificacoesConfig` (
	`id` int AUTO_INCREMENT NOT NULL,
	`usuarioId` int NOT NULL,
	`intervaloMinutos` int NOT NULL DEFAULT 30,
	`notificacaoVisual` boolean NOT NULL DEFAULT true,
	`notificacaoSonora` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notificacoesConfig_id` PRIMARY KEY(`id`),
	CONSTRAINT `notificacoesConfig_usuarioId_unique` UNIQUE(`usuarioId`)
);
--> statement-breakpoint
CREATE TABLE `pacientes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`idade` int NOT NULL,
	`especialidade` varchar(255) NOT NULL,
	`temPendencia` boolean NOT NULL DEFAULT false,
	`localPaciente` text NOT NULL,
	`outrasAcoes` text,
	`predio` enum('UPA','HOB') NOT NULL,
	`turno` enum('Diurno','Noturno') NOT NULL,
	`cadastradoPorId` int NOT NULL,
	`horaCadastro` timestamp NOT NULL DEFAULT (now()),
	`horaResolucao` timestamp,
	`status` enum('ativo','resolvido','arquivado') NOT NULL DEFAULT 'ativo',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pacientes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pendencias` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pacienteId` int NOT NULL,
	`tipoPendencia` enum('Raio X','TC','Lab','Reavaliação','1ª Avaliação','Outros') NOT NULL,
	`descricao` text,
	`status` enum('pendente','resolvida') NOT NULL DEFAULT 'pendente',
	`criadoPorId` int NOT NULL,
	`horaCriacao` timestamp NOT NULL DEFAULT (now()),
	`horaResolucao` timestamp,
	`resolvidoPorId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pendencias_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` DROP INDEX `users_openId_unique`;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `email` varchar(320) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('funcionario','admin') NOT NULL DEFAULT 'funcionario';--> statement-breakpoint
ALTER TABLE `users` ADD `firebaseUid` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `predio` enum('UPA','HOB');--> statement-breakpoint
ALTER TABLE `users` ADD `turno` enum('Diurno','Noturno');--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_firebaseUid_unique` UNIQUE(`firebaseUid`);--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `openId`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `loginMethod`;
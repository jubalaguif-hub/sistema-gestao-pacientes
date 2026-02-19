import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";
import type { User } from "../../drizzle/schema";

const mockUser: User = {
  id: 1,
  firebaseUid: "test-user-123",
  email: "test@hospital.com",
  name: "Test User",
  role: "funcionario",
  predio: "UPA",
  turno: "Diurno",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

const mockContext: TrpcContext = {
  user: mockUser,
  req: {
    headers: {},
  } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
};

describe("pacientes router", () => {
  it("should create a patient with pending issues", async () => {
    const caller = appRouter.createCaller(mockContext);

    const result = await caller.pacientes.create({
      nome: "João Silva",
      idade: 45,
      especialidade: "Cardiologia",
      temPendencia: true,
      localPaciente: "Leito 5",
      outrasAcoes: "Monitorar pressão",
      pendencias: [
        {
          tipo: "Raio X",
          descricao: "Raio X de tórax",
        },
      ],
    });

    expect(result.success).toBe(true);
    expect(result.pacienteId).toBeDefined();
  });

  it("should create a patient without pending issues", async () => {
    const caller = appRouter.createCaller(mockContext);

    const result = await caller.pacientes.create({
      nome: "Maria Santos",
      idade: 32,
      especialidade: "Pediatria",
      temPendencia: false,
      localPaciente: "Sala de espera",
    });

    expect(result.success).toBe(true);
    expect(result.pacienteId).toBeDefined();
  });

  it("should list patients from the same shift and building", async () => {
    const caller = appRouter.createCaller(mockContext);

    // Create a patient first
    await caller.pacientes.create({
      nome: "Test Patient",
      idade: 50,
      especialidade: "Ortopedia",
      temPendencia: false,
      localPaciente: "Leito 1",
    });

    // List patients
    const result = await caller.pacientes.list();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should reject unauthorized access", async () => {
    const unauthedContext: TrpcContext = {
      user: null,
      req: { headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(unauthedContext);

    try {
      await caller.pacientes.create({
        nome: "Unauthorized",
        idade: 30,
        especialidade: "Test",
        temPendencia: false,
        localPaciente: "Test",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });
});

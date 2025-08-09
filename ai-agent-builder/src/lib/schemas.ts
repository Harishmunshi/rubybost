import { z } from "zod";

export const StepTypeEnum = z.enum(["ai.generate", "http.get"]);

export const AgentStepSchema = z.object({
  id: z.string().min(1),
  type: StepTypeEnum,
  input: z.union([
    z.object({
      prompt: z.string().min(1),
    }).strict(),
    z.object({
      url: z.string().url(),
    }).strict(),
  ]),
});

export const AgentRunRequestSchema = z.object({
  name: z.string().min(1),
  goal: z.string().min(1),
  model: z.string().default("gpt-4o-mini"),
  steps: z.array(AgentStepSchema).min(1),
});

export type AgentRunRequest = z.infer<typeof AgentRunRequestSchema>;

export type AgentLogEntry = {
  stepId: string;
  stepType: z.infer<typeof StepTypeEnum>;
  summary: string;
  outputPreview?: string;
  error?: string;
};

export const AgentRunResponseSchema = z.object({
  success: z.boolean(),
  logs: z.array(
    z.object({
      stepId: z.string(),
      stepType: StepTypeEnum,
      summary: z.string(),
      outputPreview: z.string().optional(),
      error: z.string().optional(),
    })
  ),
  finalMemory: z.array(z.string()),
});

export type AgentRunResponse = z.infer<typeof AgentRunResponseSchema>;
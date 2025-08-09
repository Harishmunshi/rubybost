import { NextResponse } from "next/server";
import { AgentRunRequestSchema, StepTypeEnum, type AgentLogEntry } from "@/lib/schemas";
import { getOpenAIClient } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = AgentRunRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { name, goal, steps, model } = parsed.data;

    const openai = getOpenAIClient();

    const memory: string[] = [];
    const logs: AgentLogEntry[] = [];

    for (const step of steps) {
      try {
        if (step.type === StepTypeEnum.enum["ai.generate"]) {
          const prompt = (step.input as { prompt: string }).prompt;
          const systemPreamble = `You are an automation agent named ${name}. Your goal is: ${goal}. Maintain concise outputs that are directly useful for the next steps.`;
          const historyContext = memory.length
            ? `Relevant memory so far:\n- ${memory.slice(-3).join("\n- ")}`
            : "No prior memory.";

          const completion = await openai.chat.completions.create({
            model,
            temperature: 0.2,
            messages: [
              { role: "system", content: systemPreamble },
              { role: "user", content: `${historyContext}\n\nTask: ${prompt}` },
            ],
          });

          const content = completion.choices?.[0]?.message?.content ?? "";
          const trimmed = content.trim();
          memory.push(trimmed);
          logs.push({
            stepId: step.id,
            stepType: step.type,
            summary: `Generated AI output (${trimmed.length} chars)`,
            outputPreview: trimmed.slice(0, 500),
          });
        } else if (step.type === StepTypeEnum.enum["http.get"]) {
          const url = (step.input as { url: string }).url;
          const res = await fetch(url, { method: "GET" });
          const text = await res.text();
          const sample = text.slice(0, 2000);
          memory.push(`Fetched ${url}. Sample content: ${sample}`);
          logs.push({
            stepId: step.id,
            stepType: step.type,
            summary: `Fetched URL with status ${res.status}`,
            outputPreview: sample,
          });
        } else {
          throw new Error(`Unsupported step type: ${step.type}`);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        logs.push({
          stepId: step.id,
          stepType: step.type,
          summary: `Step failed`,
          error: message,
        });
        // Continue to next steps even if one fails
      }
    }

    return NextResponse.json({ success: true, logs, finalMemory: memory });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
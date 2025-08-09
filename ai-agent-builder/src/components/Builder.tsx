"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type StepType = "ai.generate" | "http.get";

type Step =
  | { id: string; type: "ai.generate"; input: { prompt: string } }
  | { id: string; type: "http.get"; input: { url: string } };

export default function Builder() {
  const [name, setName] = useState("Automation Agent");
  const [goal, setGoal] = useState("Research a topic and summarize key insights.");
  const [model, setModel] = useState("gpt-4o-mini");
  const [steps, setSteps] = useState<Step[]>([
    { id: uuidv4(), type: "ai.generate", input: { prompt: "What are the latest trends in AI agents?" } },
  ]);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<
    { stepId: string; stepType: StepType; summary: string; outputPreview?: string; error?: string }[]
  >([]);

  const addStep = (type: StepType) => {
    const id = uuidv4();
    if (type === "ai.generate") {
      setSteps((s) => [...s, { id, type, input: { prompt: "" } }]);
    } else {
      setSteps((s) => [...s, { id, type, input: { url: "https://example.com" } }]);
    }
  };

  const updateStepType = (id: string, type: StepType) => {
    setSteps((s) =>
      s.map((st) =>
        st.id === id
          ? type === "ai.generate"
            ? { id, type, input: { prompt: "" } }
            : { id, type, input: { url: "https://example.com" } }
          : st
      )
    );
  };

  const updateStepInput = (id: string, field: "prompt" | "url", value: string) => {
    setSteps((s) =>
      s.map((st) => {
        if (st.id !== id) return st;
        if (st.type === "ai.generate" && field === "prompt") {
          return { ...st, input: { prompt: value } };
        }
        if (st.type === "http.get" && field === "url") {
          return { ...st, input: { url: value } };
        }
        return st;
      })
    );
  };

  const removeStep = (id: string) => setSteps((s) => s.filter((st) => st.id !== id));

  const runAgent = async () => {
    setRunning(true);
    setLogs([]);
    try {
      const res = await fetch("/api/agent/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, goal, model, steps }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ? JSON.stringify(data.error) : "Run failed");
      setLogs(data.logs ?? []);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      setLogs((l) => [
        ...l,
        { stepId: "runtime", stepType: "ai.generate", summary: "Run failed", error: message },
      ]);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">AI Agent Automation Builder</h1>

      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm text-gray-600">Agent name</span>
            <input
              className="border rounded px-3 py-2 bg-white text-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Agent"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm text-gray-600">Model</span>
            <input
              className="border rounded px-3 py-2 bg-white text-black"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="gpt-4o-mini"
            />
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-gray-600">Goal</span>
          <textarea
            className="border rounded px-3 py-2 bg-white text-black min-h-24"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Describe what the agent should accomplish"
          />
        </label>

        <div className="flex items-center justify-between mt-2">
          <h2 className="text-xl font-medium">Steps</h2>
          <div className="flex gap-2">
            <button
              className="px-3 py-2 rounded border hover:bg-gray-50"
              onClick={() => addStep("ai.generate")}
            >
              + AI Generate
            </button>
            <button
              className="px-3 py-2 rounded border hover:bg-gray-50"
              onClick={() => addStep("http.get")}
            >
              + HTTP GET
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {steps.map((st, idx) => (
            <div key={st.id} className="border rounded p-4 bg-white/70 backdrop-blur">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">#{idx + 1}</span>
                  <select
                    className="border rounded px-2 py-1 text-black"
                    value={st.type}
                    onChange={(e) => updateStepType(st.id, e.target.value as StepType)}
                  >
                    <option value="ai.generate">AI Generate</option>
                    <option value="http.get">HTTP GET</option>
                  </select>
                </div>
                <button className="text-red-600 hover:underline" onClick={() => removeStep(st.id)}>
                  Remove
                </button>
              </div>

              {st.type === "ai.generate" ? (
                <label className="flex flex-col gap-2">
                  <span className="text-sm text-gray-600">Prompt</span>
                  <textarea
                    className="border rounded px-3 py-2 bg-white text-black min-h-24"
                    value={st.input.prompt}
                    onChange={(e) => updateStepInput(st.id, "prompt", e.target.value)}
                    placeholder="Describe the specific task for this step"
                  />
                </label>
              ) : (
                <label className="flex flex-col gap-2">
                  <span className="text-sm text-gray-600">URL</span>
                  <input
                    className="border rounded px-3 py-2 bg-white text-black"
                    value={st.input.url}
                    onChange={(e) => updateStepInput(st.id, "url", e.target.value)}
                    placeholder="https://example.com"
                  />
                </label>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mt-2">
          <button
            className="px-4 py-2 rounded bg-black text-white disabled:opacity-60"
            onClick={runAgent}
            disabled={running || steps.length === 0}
          >
            {running ? "Running..." : "Run Agent"}
          </button>
        </div>

        {logs.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Logs</h3>
            <div className="flex flex-col gap-3">
              {logs.map((l) => (
                <div key={l.stepId} className="border rounded p-3 bg-white/70">
                  <div className="text-sm text-gray-600 mb-1">
                    Step {l.stepId} • {l.stepType}
                  </div>
                  <div className="font-medium">{l.summary}</div>
                  {l.error ? (
                    <div className="text-red-600 text-sm mt-1">{l.error}</div>
                  ) : (
                    l.outputPreview && (
                      <pre className="whitespace-pre-wrap break-words text-sm mt-2 max-h-64 overflow-auto">
                        {l.outputPreview}
                      </pre>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
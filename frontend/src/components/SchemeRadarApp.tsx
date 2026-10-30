"use client";

import { FormEvent, useEffect, useState } from "react";

import {
  discoverAndMatch,
  getHealth,
  researchScholarships,
  sendChatMessage,
} from "@/src/services/schemeRadar";
import type { MatchItem, StudentProfile } from "@/src/types";

type Mode = "chat" | "research" | "discover";

const emptyProfile: StudentProfile = {
  state: "Karnataka",
  course: "BE",
  education_level: "undergraduate",
  year_of_study: 1,
  annual_family_income: 300000,
  category: "OBC",
};

function statusClass(status: MatchItem["status"]) {
  if (status === "eligible") {
    return "bg-emerald-900/40 text-emerald-300 border-emerald-700";
  }
  if (status === "not_eligible") {
    return "bg-red-900/40 text-red-300 border-red-800";
  }
  return "bg-amber-900/40 text-amber-200 border-amber-800";
}

export default function SchemeRadarApp() {
  const [mode, setMode] = useState<Mode>("chat");
  const [backendStatus, setBackendStatus] = useState("checking FastAPI…");
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState(
    "Karnataka undergraduate engineering scholarships"
  );
  const [profile, setProfile] = useState<StudentProfile>(emptyProfile);
  const [output, setOutput] = useState("");
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getHealth()
      .then((health) => {
        setBackendStatus(`${health.assistant} ${health.status} on :8000`);
      })
      .catch(() => {
        setBackendStatus("FastAPI on localhost:8000 is not reachable");
      });
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMatches([]);
    setOutput("");

    try {
      if (mode === "chat") {
        const result = await sendChatMessage(message);
        setOutput(result.response);
      } else if (mode === "research") {
        const result = await researchScholarships(query);
        setOutput(
          `${result.research}\n\nSources:\n${result.sources_checked.join("\n")}`
        );
      } else {
        const result = await discoverAndMatch(query, profile);
        setMatches(result.matches);
        setOutput(
          result.message ||
            `Found ${result.total_scholarships_found ?? result.matches.length} scholarships. Eligible: ${result.eligible}. Needs information: ${result.needs_information}. Not eligible: ${result.not_eligible}.`
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 px-6 py-5">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">
          SchemeRadar
        </p>
        <h1 className="mt-1 text-2xl font-semibold">
          Find government scholarships
        </h1>
        <p className="mt-2 text-sm text-zinc-400">{backendStatus}</p>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-8">
        <div className="flex gap-2">
          {(["chat", "research", "discover"] as Mode[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              className={`rounded-full px-4 py-2 text-sm capitalize ${
                mode === item
                  ? "bg-emerald-700 text-white"
                  : "bg-zinc-800 text-zinc-300"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
        >
          {mode === "chat" ? (
            <label className="block text-sm">
              Message
              <textarea
                className="mt-2 min-h-28 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Ask SchemeRadar about scholarships"
                required
              />
            </label>
          ) : (
            <label className="block text-sm">
              Query
              <input
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                required
              />
            </label>
          )}

          {mode === "discover" && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-sm">
                State
                <input
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2"
                  value={profile.state}
                  onChange={(event) =>
                    setProfile({ ...profile, state: event.target.value })
                  }
                />
              </label>
              <label className="text-sm">
                Course
                <input
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2"
                  value={profile.course}
                  onChange={(event) =>
                    setProfile({ ...profile, course: event.target.value })
                  }
                />
              </label>
              <label className="text-sm">
                Education level
                <input
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2"
                  value={profile.education_level}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      education_level: event.target.value,
                    })
                  }
                />
              </label>
              <label className="text-sm">
                Year of study
                <input
                  type="number"
                  min={1}
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2"
                  value={profile.year_of_study}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      year_of_study: Number(event.target.value),
                    })
                  }
                />
              </label>
              <label className="text-sm">
                Annual family income
                <input
                  type="number"
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2"
                  value={profile.annual_family_income ?? ""}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      annual_family_income: event.target.value
                        ? Number(event.target.value)
                        : null,
                    })
                  }
                />
              </label>
              <label className="text-sm">
                Category
                <input
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2"
                  value={profile.category ?? ""}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      category: event.target.value || null,
                    })
                  }
                />
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-5 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-medium disabled:opacity-60"
          >
            {busy ? "Calling FastAPI…" : `Call /${mode === "discover" ? "discover-and-match" : mode}`}
          </button>
        </form>

        {error && (
          <p className="rounded-xl border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        {output && (
          <pre className="whitespace-pre-wrap rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm leading-6 text-zinc-200">
            {output}
          </pre>
        )}

        {matches.length > 0 && (
          <ul className="grid gap-3">
            {matches.map((item) => (
              <li
                key={`${item.scholarship}-${item.status}`}
                className={`rounded-xl border px-4 py-3 ${statusClass(item.status)}`}
              >
                <p className="font-medium">{item.scholarship}</p>
                <p className="mt-1 text-xs uppercase tracking-wide">
                  {item.status.replace("_", " ")}
                </p>
                {item.reasons.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 text-sm">
                    {item.reasons.map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

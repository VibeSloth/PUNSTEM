"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { SignInPage } from "@/components/ui/sign-in";
import type { AuthCredentials, AuthResponse } from "@/lib/contracts/auth";
import { usePunstemTheme } from "@/hooks/use-punstem-theme";
import "@/app/sign-in.css";

async function readAuth(response: Response): Promise<AuthResponse> {
  try {
    const data: unknown = await response.json();
    if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Invalid response");
    return data as AuthResponse;
  }
  catch { throw new Error("Could not reach account services. Please try again."); }
}

export default function AccountSignIn() {
  usePunstemTheme();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inFlight = useRef(false);
  const sessionRequest = useRef<AbortController | null>(null);
  const submitRequest = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    sessionRequest.current = controller;
    void (async () => {
      try {
        const response = await fetch("/api/auth/me", { credentials: "same-origin", cache: "no-store", signal: controller.signal });
        const data = await readAuth(response);
        if (controller.signal.aborted) return;
        if (!response.ok) throw new Error("Could not check your session. You can sign in again below.");
        if (data.user?.userId) { window.location.replace("/home.html"); return; }
      } catch (cause) {
        if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Could not check your session.");
      } finally { if (!controller.signal.aborted) setChecking(false); }
    })();
    // The legacy feedback module installs document listeners. Load it once even
    // when React replays effects or the development page hot-reloads.
    if (!document.getElementById("punstem-feedback-bootstrap")) {
      const script = document.createElement("script");
      script.id = "punstem-feedback-bootstrap";
      script.src = "/feedback.js";
      script.onerror = () => script.remove();
      document.body.appendChild(script);
    }
    return () => { controller.abort(); submitRequest.current?.abort(); };
  }, []);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    const body: AuthCredentials = {
      email: String(fields.get("email") || "").trim(),
      password: String(fields.get("password") || ""),
      rememberMe: fields.get("rememberMe") === "on",
      ...(mode === "register" ? { displayName: String(fields.get("displayName") || "").trim() } : {}),
    };
    inFlight.current = true;
    sessionRequest.current?.abort();
    const controller = new AbortController();
    submitRequest.current = controller;
    setBusy(true); setError("");
    try {
      const response = await fetch(`/api/auth/${mode === "register" ? "register" : "login"}`, {
        method: "POST", credentials: "same-origin", cache: "no-store",
        headers: { "content-type": "application/json" }, body: JSON.stringify(body), signal: controller.signal,
      });
      const data = await readAuth(response);
      if (!response.ok) throw new Error(data.error || "Could not sign in. Please try again.");
      const check = await fetch("/api/auth/me", { credentials: "same-origin", cache: "no-store", signal: controller.signal });
      const session = await readAuth(check);
      if (!check.ok || !session.user?.userId) {
        // Registration succeeded; retry must be a login, not duplicate registration.
        setMode("login");
        throw new Error("Your browser did not retain the session. Allow cookies for this site, then sign in. Your account is unchanged.");
      }
      const password = form.elements.namedItem("password");
      if (password instanceof HTMLInputElement) password.value = "";
      window.location.replace("/home.html");
    } catch (cause) {
      if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Could not sign in. Please try again.");
    } finally {
      inFlight.current = false;
      if (!controller.signal.aborted) setBusy(false);
    }
  }

  function switchMode(next: "login" | "register") { if (!inFlight.current) { setMode(next); setError(""); } }
  if (checking) return <main className="grid min-h-dvh place-items-center bg-background text-foreground"><p role="status">Checking your session…</p></main>;

  return <SignInPage
    key={mode}
    title={<><span className="mb-6 flex items-center gap-2 text-base font-semibold tracking-normal"><img src="/mascot-blue.png" alt="" width="32" height="32" />Punstem</span>{mode === "register" ? "Start your next chapter." : "Welcome back."}</>}
    description={mode === "register" ? "Create your account. Make practice personal." : "Sign in and pick up where you left off."}
    heroImageSrc="https://images.unsplash.com/photo-1525215351243-2ba501f3442c?auto=format&fit=crop&w=1600&q=85"
    mode={mode} busy={busy} error={error} onSignIn={signIn}
    onCreateAccount={() => switchMode("register")} onSignInInstead={() => switchMode("login")}
  />;
}

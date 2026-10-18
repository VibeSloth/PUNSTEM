"use client";

import React, { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

export interface SignInPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void;
  onGoogleSignIn?: () => void;
  onResetPassword?: () => void;
  onCreateAccount?: () => void;
  onSignInInstead?: () => void;
  mode?: "login" | "register";
  busy?: boolean;
  error?: string;
}

const GoogleIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.61 20.08H24v8h11.3A12 12 0 1 1 31.96 15l5.66-5.66A20 20 0 1 0 44 24c0-1.34-.13-2.65-.39-3.92Z" />
    <path fill="#FF3D00" d="m6.3 14.69 6.58 4.82A12 12 0 0 1 31.96 15l5.66-5.66A20 20 0 0 0 6.3 14.7Z" />
    <path fill="#4CAF50" d="M24 44c5.17 0 9.86-1.98 13.41-5.2l-6.19-5.23A12 12 0 0 1 12.72 28l-6.52 5.03A20 20 0 0 0 24 44Z" />
    <path fill="#1976D2" d="M43.61 20.08H24v8h11.3a12 12 0 0 1-4.08 5.49l6.19 5.23A20 20 0 0 0 44 24c0-1.34-.13-2.65-.39-3.92Z" />
  </svg>
);

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-violet-400/70 focus-within:bg-violet-500/10 focus-within:ring-2 focus-within:ring-violet-400/20">{children}</div>
);

const TestimonialCard = ({ testimonial, delay }: { testimonial: Testimonial; delay: string }) => (
  <div className={`animate-testimonial ${delay} flex w-64 shrink-0 items-start gap-3 rounded-3xl border border-white/20 bg-card/70 p-5 text-card-foreground shadow-lg backdrop-blur-xl`}>
    <img src={testimonial.avatarSrc} className="h-10 w-10 rounded-2xl object-cover" alt="" loading="lazy" />
    <div className="text-sm leading-snug"><p className="font-medium">{testimonial.name}</p><p className="text-muted-foreground">{testimonial.handle}</p><p className="mt-1 text-foreground/80">{testimonial.text}</p></div>
  </div>
);

export const SignInPage: React.FC<SignInPageProps> = ({
  title = <span className="font-light tracking-tighter">Welcome</span>,
  description = "Access your account and continue your journey with us",
  heroImageSrc, testimonials = [], onSignIn, onGoogleSignIn, onResetPassword,
  onCreateAccount, onSignInInstead, mode = "login", busy = false, error = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const id = useId();
  const inputClass = "w-full rounded-2xl bg-transparent p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none";
  const register = mode === "register";

  return (
    <main className="punstem-signin font-geist flex min-h-dvh w-full flex-col bg-background text-foreground md:flex-row">
      <section className="flex min-w-0 flex-1 items-center justify-center px-6 py-12 md:p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <h1 className="animate-element animate-delay-100 text-4xl font-light leading-tight tracking-tighter md:text-5xl">{title}</h1>
            <p className="animate-element animate-delay-200 text-muted-foreground">{description}</p>
            <form aria-busy={busy} aria-describedby={error ? `${id}-error` : undefined} onSubmit={event => { event.preventDefault(); onSignIn?.(event); }}>
              <fieldset disabled={busy} className="min-w-0 space-y-5 border-0 p-0 disabled:opacity-70">
                {register && <div className="animate-element animate-delay-200"><label htmlFor={`${id}-name`} className="mb-2 block text-sm font-medium text-muted-foreground">Name</label><GlassInputWrapper><input id={`${id}-name`} name="displayName" autoComplete="name" maxLength={24} required placeholder="Your name" className={inputClass} /></GlassInputWrapper></div>}
                <div className="animate-element animate-delay-300">
                  <label htmlFor={`${id}-email`} className="mb-2 block text-sm font-medium text-muted-foreground">Email address</label>
                  <GlassInputWrapper><input id={`${id}-email`} name="email" type="email" autoComplete="email" maxLength={120} required placeholder="Enter your email address" className={inputClass} /></GlassInputWrapper>
                </div>
                <div className="animate-element animate-delay-400">
                  <label htmlFor={`${id}-password`} className="mb-2 block text-sm font-medium text-muted-foreground">Password</label>
                  <GlassInputWrapper><div className="relative">
                    <input id={`${id}-password`} name="password" type={showPassword ? "text" : "password"} autoComplete={register ? "new-password" : "current-password"} minLength={8} maxLength={128} required placeholder={register ? "Create a password (8+ characters)" : "Enter your password"} className={`${inputClass} pr-14`} />
                    <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} aria-controls={`${id}-password`} onClick={() => setShowPassword(value => !value)} className="absolute inset-y-0 right-2 flex w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400">{showPassword ? <EyeOff aria-hidden="true" className="h-5 w-5" /> : <Eye aria-hidden="true" className="h-5 w-5" />}</button>
                  </div></GlassInputWrapper>
                </div>
                <div className="animate-element animate-delay-500 flex flex-wrap items-center justify-between gap-3 text-sm">
                  <label className="flex cursor-pointer items-center gap-3"><input type="checkbox" name="rememberMe" defaultChecked className="custom-checkbox h-4 w-4 rounded border-border accent-violet-500" /><span>Keep me signed in</span></label>
                  {onResetPassword && !register && <button type="button" onClick={onResetPassword} className="rounded text-violet-500 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-violet-400">Reset password</button>}
                </div>
                <button type="submit" className="animate-element animate-delay-600 w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-400 disabled:cursor-wait">{busy ? "Working…" : register ? "Create account" : "Sign in"}</button>
              </fieldset>
              <div id={`${id}-error`} role="alert" className="mt-3 text-sm text-destructive">{error}</div>
            </form>
            {onGoogleSignIn && <>
              <div className="animate-element animate-delay-700 relative flex items-center justify-center"><span className="w-full border-t border-border" /><span className="absolute bg-background px-4 text-sm text-muted-foreground">Or continue with</span></div>
              <button type="button" disabled={busy} onClick={onGoogleSignIn} className="animate-element animate-delay-800 flex w-full items-center justify-center gap-3 rounded-2xl border border-border py-4 transition-colors hover:bg-secondary disabled:opacity-50"><GoogleIcon />Continue with Google</button>
            </>}
            {(!register && onCreateAccount || register && onSignInInstead) && <p className="animate-element animate-delay-900 text-center text-sm text-muted-foreground">{register ? "Already have an account? " : "New to Punstem? "}<button type="button" disabled={busy} onClick={register ? onSignInInstead : onCreateAccount} className="rounded text-violet-500 hover:underline focus-visible:outline-2 focus-visible:outline-violet-400 disabled:opacity-50">{register ? "Sign in" : "Create account"}</button></p>}
          </div>
        </div>
      </section>
      {heroImageSrc && <section aria-label="Night sky" className="relative hidden min-w-0 flex-1 overflow-hidden p-4 md:block">
        <div className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl bg-violet-950 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(180deg, rgb(40 15 65 / .08), rgb(35 10 60 / .4)), url(${JSON.stringify(heroImageSrc)})` }} />
        {testimonials.length > 0 && <div className="absolute bottom-8 left-1/2 flex w-full -translate-x-1/2 justify-center gap-4 px-8"><TestimonialCard testimonial={testimonials[0]} delay="animate-delay-1000" />{testimonials[1] && <div className="hidden xl:flex"><TestimonialCard testimonial={testimonials[1]} delay="animate-delay-1200" /></div>}{testimonials[2] && <div className="hidden 2xl:flex"><TestimonialCard testimonial={testimonials[2]} delay="animate-delay-1400" /></div>}</div>}
      </section>}
    </main>
  );
};

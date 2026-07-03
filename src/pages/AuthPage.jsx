import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useShop } from "../context/ShopContext.jsx";

export default function AuthPage() {
  const { login, signup, demoLogin } = useAuth();
  const { toast } = useShop();
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [pwScore, setPwScore] = useState(0);
  const [showPw, setShowPw] = useState(false);
  const cardRef = useRef(null);

  const [form, setForm] = useState({ name: "", email: "", password: "", password2: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const shake = () => {
    const c = cardRef.current;
    c.classList.remove("shake");
    void c.offsetWidth;
    c.classList.add("shake");
  };

  const onPassword = (e) => {
    set("password")(e);
    const v = e.target.value;
    let score = 0;
    if (v.length >= 6) score++;
    if (v.length >= 10) score++;
    if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
    if (/\d/.test(v) && /[^A-Za-z0-9]/.test(v)) score++;
    setPwScore(score);
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      const u = await login(form.email, form.password);
      toast(`Welcome back, ${u.name.split(" ")[0]}!`, "success");
    } catch (ex) { setError(ex.message); shake(); }
    finally { setBusy(false); }
  };

  const submitSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (form.name.trim().length < 2) return setError("Please enter your name.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.password2) return setError("Passwords don't match.");
    setBusy(true);
    try {
      await signup({ name: form.name, email: form.email, password: form.password });
      toast(`Account created. Welcome, ${form.name.split(" ")[0]}!`, "success");
    } catch (ex) { setError(ex.message); shake(); }
    finally { setBusy(false); }
  };

  const onDemo = async () => {
    setBusy(true);
    await demoLogin();
    toast("Signed in as Demo Shopper", "success");
  };

  const switchMode = (m) => { setMode(m); setError(""); };

  return (
    <div className="auth-screen">
      <div className="auth-bg-orbs"><span /><span /><span /></div>
      <div className="auth-card" ref={cardRef} role="dialog" aria-label="Sign in to NovaKart">
        <div className="auth-logo">nova<span>kart</span><em>.in</em></div>

        {mode === "login" ? (
          <form className="auth-form" onSubmit={submitLogin} noValidate>
            <h1>Sign in</h1>
            <label className="field">
              <span>Email or mobile number</span>
              <input type="email" required autoComplete="username" placeholder="you@example.com"
                     value={form.email} onChange={set("email")} />
            </label>
            <label className="field">
              <span>Password</span>
              <div className="pw-wrap">
                <input type={showPw ? "text" : "password"} required autoComplete="current-password"
                       placeholder="••••••••" value={form.password} onChange={set("password")} />
                <button type="button" className="pw-toggle" aria-label="Show password"
                        onClick={() => setShowPw((s) => !s)}>👁</button>
              </div>
            </label>
            <p className="auth-error" role="alert">{error}</p>
            <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}
            </button>
            <p className="auth-fineprint">
              By continuing, you agree to NovaKart's <a href="#!">Conditions of Use</a> and <a href="#!">Privacy Notice</a>.
            </p>
            <div className="auth-divider"><span>New to NovaKart?</span></div>
            <button type="button" className="btn btn-ghost btn-block" onClick={() => switchMode("signup")}>
              Create your NovaKart account
            </button>
            <button type="button" className="btn btn-demo btn-block" onClick={onDemo} disabled={busy}>
              ⚡ Try instantly with demo account
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={submitSignup} noValidate>
            <h1>Create account</h1>
            <label className="field">
              <span>Your name</span>
              <input type="text" required autoComplete="name" placeholder="First and last name"
                     value={form.name} onChange={set("name")} />
            </label>
            <label className="field">
              <span>Email</span>
              <input type="email" required autoComplete="username" placeholder="you@example.com"
                     value={form.email} onChange={set("email")} />
            </label>
            <label className="field">
              <span>Password <small>(at least 6 characters)</small></span>
              <div className="pw-wrap">
                <input type={showPw ? "text" : "password"} required minLength={6} autoComplete="new-password"
                       placeholder="At least 6 characters" value={form.password} onChange={onPassword} />
                <button type="button" className="pw-toggle" aria-label="Show password"
                        onClick={() => setShowPw((s) => !s)}>👁</button>
              </div>
            </label>
            <div className="pw-meter">
              <i style={{
                width: `${pwScore * 25}%`,
                background: pwScore <= 1 ? "var(--danger)" : pwScore <= 2 ? "var(--accent-hover)" : "var(--success)",
              }} />
            </div>
            <label className="field">
              <span>Re-enter password</span>
              <input type="password" required autoComplete="new-password" placeholder="Re-enter password"
                     value={form.password2} onChange={set("password2")} />
            </label>
            <p className="auth-error" role="alert">{error}</p>
            <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
              {busy ? "Creating account…" : "Create your NovaKart account"}
            </button>
            <div className="auth-divider"><span>Already have an account?</span></div>
            <button type="button" className="btn btn-ghost btn-block" onClick={() => switchMode("login")}>
              Sign in instead
            </button>
          </form>
        )}
      </div>
      <p className="auth-footer">© 2026 NovaKart · A portfolio demo build — not affiliated with Amazon</p>
    </div>
  );
}

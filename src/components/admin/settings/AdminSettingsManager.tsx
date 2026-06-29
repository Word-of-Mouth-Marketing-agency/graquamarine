"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import type { AdminIdentity } from "@/types";

type AdminSettingsManagerProps = {
  initialAdmin: AdminIdentity;
};

type Feedback = {
  type: "success" | "error";
  message: string;
} | null;

const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-brand-navy/15 bg-white px-4 text-sm text-brand-navy outline-none transition placeholder:text-brand-navy/35 focus:border-brand-aqua focus:ring-4 focus:ring-brand-aqua/10";

const labelClass = "block text-sm font-semibold text-brand-navy";

function FeedbackMessage({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null;

  return (
    <p
      className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
        feedback.type === "success"
          ? "border border-brand-aqua/20 bg-brand-aqua/10 text-brand-navy"
          : "border border-slate-200 bg-slate-50 text-brand-navy/70"
      }`}
      role={feedback.type === "error" ? "alert" : "status"}
    >
      {feedback.message}
    </p>
  );
}

export function AdminSettingsManager({
  initialAdmin,
}: AdminSettingsManagerProps) {
  const router = useRouter();
  const [admin, setAdmin] = useState(initialAdmin);
  const [name, setName] = useState(initialAdmin.name);
  const [email, setEmail] = useState(initialAdmin.email);
  const [emailPassword, setEmailPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<Feedback>(null);
  const [emailFeedback, setEmailFeedback] = useState<Feedback>(null);
  const [passwordFeedback, setPasswordFeedback] = useState<Feedback>(null);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingProfile(true);
    setProfileFeedback(null);

    try {
      const response = await fetch("/api/admin/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not save profile.");
      }

      setAdmin(data);
      setName(data.name);
      setProfileFeedback({
        type: "success",
        message: "Profile updated successfully.",
      });
      router.refresh();
    } catch (error) {
      setProfileFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Could not save profile.",
      });
    } finally {
      setSavingProfile(false);
    }
  }

  async function saveEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingEmail(true);
    setEmailFeedback(null);

    try {
      const response = await fetch("/api/admin/account/email", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          currentPassword: emailPassword,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not update email.");
      }

      setAdmin(data);
      setEmail(data.email);
      setEmailPassword("");
      setEmailFeedback({
        type: "success",
        message: "Email updated successfully.",
      });
      router.refresh();
    } catch (error) {
      setEmailFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Could not update email.",
      });
    } finally {
      setSavingEmail(false);
    }
  }

  async function savePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingPassword(true);
    setPasswordFeedback(null);

    try {
      const response = await fetch("/api/admin/account/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not update password.");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordFeedback({
        type: "success",
        message: "Password updated successfully.",
      });
    } catch (error) {
      setPasswordFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Could not update password.",
      });
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <AdminShell
      title="Settings"
      subtitle="Manage your admin account and login details."
      admin={admin}
    >
      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-2xl border border-brand-aqua/15 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-aqua">
            Account Control
          </p>
          <h2 className="mt-2 text-2xl font-bold text-brand-navy">
            {admin.name}
          </h2>
          <p className="mt-1 break-all text-sm font-semibold text-brand-navy/55">
            {admin.email}
          </p>
          <div className="mt-6 grid gap-3 text-sm">
            <div className="rounded-2xl bg-[#f7fbfd] p-4">
              <p className="font-semibold text-brand-navy">Profile</p>
              <p className="mt-1 text-brand-navy/60">
                This name appears in the admin dashboard.
              </p>
            </div>
            <div className="rounded-2xl bg-[#f7fbfd] p-4">
              <p className="font-semibold text-brand-navy">Email & login</p>
              <p className="mt-1 text-brand-navy/60">
                Use this email to sign in.
              </p>
            </div>
            <div className="rounded-2xl bg-[#f7fbfd] p-4">
              <p className="font-semibold text-brand-navy">Password</p>
              <p className="mt-1 text-brand-navy/60">
                Choose a strong password to protect your dashboard.
              </p>
            </div>
          </div>
        </section>

        <div className="space-y-5">
          <section className="rounded-2xl border border-brand-aqua/15 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-brand-aqua">
                Profile
              </p>
              <h2 className="mt-1 text-xl font-bold text-brand-navy">
                Admin name
              </h2>
              <p className="mt-1 text-sm leading-6 text-brand-navy/60">
                This name appears in the admin dashboard.
              </p>
            </div>

            <form className="mt-5 space-y-4" onSubmit={saveProfile}>
              <div>
                <label className={labelClass} htmlFor="adminName">
                  Name
                </label>
                <input
                  id="adminName"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  minLength={2}
                  maxLength={80}
                  required
                  className={inputClass}
                />
              </div>
              <FeedbackMessage feedback={profileFeedback} />
              <button
                type="submit"
                disabled={savingProfile}
                className="h-11 rounded-full bg-brand-aqua px-5 text-sm font-bold text-white transition hover:bg-brand-navy disabled:cursor-not-allowed disabled:opacity-55"
              >
                {savingProfile ? "Saving..." : "Save profile"}
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-brand-aqua/15 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-brand-aqua">
                Email & login
              </p>
              <h2 className="mt-1 text-xl font-bold text-brand-navy">
                Sign-in email
              </h2>
              <p className="mt-1 text-sm leading-6 text-brand-navy/60">
                Confirm your current password before changing the login email.
              </p>
            </div>

            <form className="mt-5 space-y-4" onSubmit={saveEmail}>
              <div>
                <label className={labelClass} htmlFor="adminEmail">
                  New email
                </label>
                <input
                  id="adminEmail"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="emailPassword">
                  Current password
                </label>
                <input
                  id="emailPassword"
                  type="password"
                  value={emailPassword}
                  onChange={(event) => setEmailPassword(event.target.value)}
                  required
                  autoComplete="current-password"
                  className={inputClass}
                  placeholder="Confirm your password"
                />
              </div>
              <FeedbackMessage feedback={emailFeedback} />
              <button
                type="submit"
                disabled={savingEmail}
                className="h-11 rounded-full bg-brand-aqua px-5 text-sm font-bold text-white transition hover:bg-brand-navy disabled:cursor-not-allowed disabled:opacity-55"
              >
                {savingEmail ? "Saving..." : "Save email"}
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-brand-aqua/15 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-brand-aqua">
                Password
              </p>
              <h2 className="mt-1 text-xl font-bold text-brand-navy">
                Change password
              </h2>
              <p className="mt-1 text-sm leading-6 text-brand-navy/60">
                Use at least 8 characters.
              </p>
            </div>

            <form className="mt-5 space-y-4" onSubmit={savePassword}>
              <div>
                <label className={labelClass} htmlFor="currentPassword">
                  Current password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  required
                  autoComplete="current-password"
                  className={inputClass}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="newPassword">
                    New password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    minLength={8}
                    required
                    autoComplete="new-password"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="confirmPassword">
                    Confirm new password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    minLength={8}
                    required
                    autoComplete="new-password"
                    className={inputClass}
                  />
                </div>
              </div>
              <FeedbackMessage feedback={passwordFeedback} />
              <button
                type="submit"
                disabled={savingPassword}
                className="h-11 rounded-full bg-brand-aqua px-5 text-sm font-bold text-white transition hover:bg-brand-navy disabled:cursor-not-allowed disabled:opacity-55"
              >
                {savingPassword ? "Saving..." : "Save password"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}

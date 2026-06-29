import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/admin/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Admin Password",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}

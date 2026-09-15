import { Outlet } from "react-router-dom";
import AuthBackdrop from "../components/AuthBackdrop";
import BrandLockup from "../components/BrandLockup";

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <AuthBackdrop />
      <div className="auth-layout__brand">
        <BrandLockup size="lg" />
      </div>
      <main className="auth-layout__slot">
        <Outlet />
      </main>
    </div>
  );
}

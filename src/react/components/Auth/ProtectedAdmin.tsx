import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth";

const ProtectedAdmin: React.FC = () => {
  const location = useLocation();
  const { token, verifyWithBackend } = useAuth();
  const [checking, setChecking] = useState(true);
  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const ok = await verifyWithBackend(token);
      if (!mounted) return;
      setVerified(ok);
      setChecking(false);
    })();
    return () => {
      mounted = false;
    };
  }, [token, verifyWithBackend]);

  if (checking) {
    // simple placeholder while verifying; keep minimal to avoid layout shift
    return (
      <div className="flex min-h-screen items-center justify-center">
        Checking admin...
      </div>
    );
  }

  if (verified) return <Outlet />;

  // redirect to admin login page, preserve attempted path
  return <Navigate to="/admin/login" state={{ from: location }} replace />;
};

export default ProtectedAdmin;

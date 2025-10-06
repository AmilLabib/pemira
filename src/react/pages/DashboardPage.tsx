import React, { useEffect, useState } from "react";

const DashboardPage: React.FC = () => {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/dashboard")
      .then((res) => {
        if (res.ok) setAuthorized(true);
        else setAuthorized(false);
      })
      .catch(() => setAuthorized(false));
  }, []);

  if (authorized === null) {
    return <div>Loading...</div>;
  }

  if (!authorized) {
    return <div style={{ color: "red" }}>Unauthorized</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>
      <p>
        Welcome to your dashboard. Here you can view your stats and manage your
        account. HI
      </p>
      {/* Add dashboard widgets/components here */}
    </div>
  );
};

export default DashboardPage;

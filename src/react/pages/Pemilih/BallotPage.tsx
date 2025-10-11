import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const BallotPage: React.FC = () => {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/ballot", {
      method: "GET",
      credentials: "include", // send cookies
    })
      .then((res) => {
        if (res.ok) setAuthorized(true);
        else {
          setAuthorized(false);
          navigate("/login");
        }
      })
      .catch(() => {
        setAuthorized(false);
        navigate("/login");
      });
  }, [navigate]);

  if (authorized === null) {
    return <div>Loading...</div>;
  }

  if (!authorized) {
    return <div>Unauthorized</div>;
  }

  return (
    <div>
      {/* Ballot content goes here */}
      <h1>Ballot Page (Protected)</h1>
    </div>
  );
};

export default BallotPage;

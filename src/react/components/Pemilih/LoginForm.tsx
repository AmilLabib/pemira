import React, { useState } from "react";

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [nim, setNim] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(nim, token);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid w-full max-w-sm gap-8 rounded-md border border-neutral-300 bg-white p-6 shadow-md"
    >
      <div className="grid gap-4">
        <label className="block">
          <span>NIM</span>
          <input
            className="block w-full border-0 border-b-2 border-neutral-200 px-0.5 focus:border-black focus:ring-0"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={nim}
            onChange={(e) => setNim(e.target.value.replace(/[^0-9]/g, ""))}
            required
          />
        </label>
        <label className="block">
          <span>Token</span>
          <input
            className="block w-full border-0 border-b-2 border-neutral-200 px-0.5 focus:border-black focus:ring-0"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={token}
            onChange={(e) => setToken(e.target.value.replace(/[^0-9]/g, ""))}
            required
          />
        </label>
      </div>
      <button
        type="submit"
        className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;

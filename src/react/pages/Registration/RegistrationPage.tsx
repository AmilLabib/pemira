import React from "react";
import RegistrationForm from "../../components/Registration/RegistrationForm";

const RegistrationPage: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-16 text-left">
      <h1 className="mb-6 text-center text-2xl font-bold">
        Formulir Pendaftaran Bakal Calon
      </h1>
      <RegistrationForm />
    </main>
  );
};

export default RegistrationPage;

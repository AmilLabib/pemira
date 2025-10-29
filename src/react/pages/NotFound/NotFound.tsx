import React from "react";
import { Link } from "react-router";
import gif from "../../assets/MainWeb/404.gif";

const NotFound: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-lg text-center">
        <img
          src={gif}
          alt="404 not found"
          className="mx-auto mb-6 h-full w-full object-contain"
        />
        <h1 className="mb-2 text-3xl font-bold">Page not found</h1>
        <p className="mb-6 text-gray-600">
          The page you are looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../auth/LoginForm";
import RegisterForm from "../auth/RegisterForm";
import DirectLoginForm from "../auth/DirectLoginForm";
import AdminLoginForm from "../auth/AdminLoginForm";
import DirectRegisterForm from "../auth/DirectRegisterForm";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [useDirect, setUseDirect] = useState<boolean | "admin">(true); // Use direct database connection by default
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    if (isLogin) {
      navigate("/");
    } else {
      // After registration, show login form
      setIsLogin(true);
    }
  };

  // Skip CORS test and use local storage by default
  useEffect(() => {
    // Set to local storage mode by default
    setUseDirect(false);
    console.log("Using local storage mode by default");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            ASAP Tagudin Medical Diagnostic Center
          </h1>
          <h2 className="text-xl text-primary mb-2">Dialysis Unit</h2>
          <p className="text-gray-600">
            {isLogin
              ? "Welcome back! Please sign in to continue."
              : "Create an account to get started."}
          </p>
        </div>

        <div className="flex justify-center mb-4">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-200 rounded-l-lg`}
              disabled
            >
              Database (Disabled)
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${useDirect === false ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-100"} border border-gray-200`}
              onClick={() => setUseDirect(false)}
            >
              Local Storage
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${useDirect === "admin" ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-100"} border border-gray-200 rounded-r-lg`}
              onClick={() => setUseDirect("admin")}
            >
              Admin Login
            </button>
          </div>
        </div>

        {useDirect === true ? (
          // Direct database connection forms
          isLogin ? (
            <DirectLoginForm />
          ) : (
            <DirectRegisterForm onSuccess={handleAuthSuccess} />
          )
        ) : useDirect === false ? (
          // Local storage forms
          isLogin ? (
            <LoginForm
              onSuccess={handleAuthSuccess}
              onRegisterClick={() => setIsLogin(false)}
            />
          ) : (
            <RegisterForm
              onSuccess={handleAuthSuccess}
              onLoginClick={() => setIsLogin(true)}
            />
          )
        ) : (
          // Admin login (no server connection)
          <AdminLoginForm />
        )}

        <div className="text-center mt-4">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline"
          >
            {isLogin
              ? "Need an account? Register"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

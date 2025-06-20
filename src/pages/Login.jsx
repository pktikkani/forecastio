import React, { useState } from "react";
import logo from "../assets/logo.png";
import banner from "../assets/loginSideBanner.png";
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

console.log(import.meta.env.VITE_AWS_USERPOOL_ID); // Add this to debug

const poolData = {
  UserPoolId: import.meta.env.VITE_AWS_USERPOOL_ID,
  ClientId: import.meta.env.VITE_AWS_CLIENT_ID,
};

const Login = () => {
  const userPool = new CognitoUserPool(poolData);
  const { setToken, setEmailStore } = useAuth();
  const [formState, setFormState] = useState("login"); // "login", "forgotPassword", "resetPassword", "newPasswordRequired"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const loginUser = (email, password) => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    const user = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (result) => {
        setLoading(false);
        const accessToken = result.getAccessToken().getJwtToken();
        const idToken = result.getIdToken().getJwtToken();
        const refreshToken = result.getRefreshToken().getToken(); // Fixed here

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("idToken", idToken);
        localStorage.setItem("refreshToken", refreshToken);
        setToken(`Bearer ${idToken}`);
        setEmailStore(email);

        navigate("/home");
      },
      onFailure: (err) => {
        setLoading(false);
        if (
          err.code === "PasswordResetRequiredException" ||
          err.message.includes("new password")
        ) {
          setFormState("newPasswordRequired");
          setError("Please set a new password");
        } else {
          setError(err.message || "Login failed. Please try again.");
        }
      },
      newPasswordRequired: (userAttributes) => {
        const currentUser = user;

        if (newPassword && newPassword === confirmPassword) {
          currentUser.completeNewPasswordChallenge(
            newPassword,
            userAttributes,
            {
              onSuccess: (result) => {
                setLoading(false);
                setFormState("login");
                const accessToken = result.getAccessToken().getJwtToken();
                const idToken = result.getIdToken().getJwtToken();
                const refreshToken = result.getRefreshToken().getToken(); // Fixed here

                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("idToken", idToken);
                localStorage.setItem("refreshToken", refreshToken);
                setToken(`Bearer ${idToken}`);

                navigate("/home");
              },
              onFailure: (err) => {
                setLoading(false);
                setError(err.message || "Failed to set new password");
              },
            }
          );
        } else {
          setError("Passwords do not match");
        }
      },
    });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    loginUser(email, password);
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    const user = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    setLoading(true);
    user.forgotPassword({
      onSuccess: () => {
        setLoading(false);
        setSuccessMessage("Verification code sent to your email.");
        setFormState("resetPassword");
      },
      onFailure: (err) => {
        setLoading(false);
        setError(err.message || "Failed to send verification code");
      },
    });
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email || !verificationCode || !newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError(
        "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character"
      );
      return;
    }

    const user = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    setLoading(true);
    user.confirmPassword(verificationCode, newPassword, {
      onSuccess: () => {
        setLoading(false);
        setSuccessMessage("Password reset successfully. Please log in.");
        setFormState("login");
        setNewPassword("");
        setConfirmPassword("");
        setVerificationCode("");
      },
      onFailure: (err) => {
        setLoading(false);
        setError(err.message || "Failed to reset password");
      },
    });
  };

  const handleNewPasswordSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Please enter both passwords");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError(
        "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character"
      );
      return;
    }

    loginUser(email, password);
  };

  return (
    <div className="w-screen h-screen bg-white">
      <div className="flex flex-col lg:flex-row justify-between items-center bg-white">
        <div className="min-h-screen w-full lg:w-1/2 flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md bg-white">
            <div className="text-center">
              {/* <img
                src={logo}
                alt="Forcast.io Logo"
                className="mx-auto w-4xl sm:w-40 lg:w-auto"
              /> */}
            </div>
            <div className="mt-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-black">
                {formState === "forgotPassword"
                  ? "Forgot Password"
                  : formState === "resetPassword"
                  ? "Reset Password"
                  : formState === "newPasswordRequired"
                  ? "Create New Password"
                  : "Welcome Back"}
              </h2>
              <p className="mt-2 text-sm text-black">
                {formState === "forgotPassword"
                  ? "Enter your email to receive a verification code"
                  : formState === "resetPassword"
                  ? "Enter the verification code and new password"
                  : formState === "newPasswordRequired"
                  ? "Please enter your new password"
                  : "Please enter your credentials"}
              </p>
            </div>
            {formState === "login" && (
              <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-black"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  />
                </div>
                <div className="mb-4 relative">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-black"
                  >
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    <svg
                      className="h-5 w-5 text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {showPassword ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.79m0 0L21 21"
                        />
                      ) : (
                        <>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
                  <button
                    type="button"
                    onClick={() => setFormState("forgotPassword")}
                    className="text-sm text-indigo-500"
                  >
                    Forgot Password?
                  </button>
                </div>
                {error && (
                  <div className="mt-2 text-sm text-black">{error}</div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Sign In"}
                </button>
              </form>
            )}
            {formState === "forgotPassword" && (
              <form
                onSubmit={handleForgotPasswordSubmit}
                className="mt-6 space-y-4"
              >
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-black"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  />
                </div>
                {error && (
                  <div className="mt-2 text-sm text-black">{error}</div>
                )}
                {successMessage && (
                  <div className="mt-2 text-sm text-black">
                    {successMessage}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Send Verification Code"}
                </button>
                <button
                  type="button"
                  onClick={() => setFormState("login")}
                  className="w-full py-2 px-4 mt-2 bg-gray-200 text-black font-medium rounded-md hover:bg-gray-300 focus:outline-none"
                >
                  Back to Sign In
                </button>
              </form>
            )}
            {formState === "resetPassword" && (
              <form
                onSubmit={handleResetPasswordSubmit}
                className="mt-6 space-y-4"
              >
                <div className="mb-4">
                  <label
                    htmlFor="verificationCode"
                    className="block text-sm font-medium text-black"
                  >
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id="verificationCode"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter verification code"
                    className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  />
                </div>
                <div className="mb-4 relative">
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-black"
                  >
                    New Password
                  </label>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
                    aria-label={
                      showNewPassword ? "Hide password" : "Show password"
                    }
                  >
                    <svg
                      className="h-5 w-5 text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {showNewPassword ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.79m0 0L21 21"
                        />
                      ) : (
                        <>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                <div className="mb-4 relative">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-black"
                  >
                    Confirm Password
                  </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    <svg
                      className="h-5 w-5 text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {showConfirmPassword ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.79m0 0L21 21"
                        />
                      ) : (
                        <>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                {error && (
                  <div className="mt-2 text-sm text-black">{error}</div>
                )}
                {successMessage && (
                  <div className="mt-2 text-sm text-black">
                    {successMessage}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Reset Password"}
                </button>
                <button
                  type="button"
                  onClick={() => setFormState("login")}
                  className="w-full py-2 px-4 mt-2 bg-gray-200 text-black font-medium rounded-md hover:bg-gray-300 focus:outline-none"
                >
                  Back to Sign In
                </button>
              </form>
            )}
            {formState === "newPasswordRequired" && (
              <form
                onSubmit={handleNewPasswordSubmit}
                className="mt-6 space-y-4"
              >
                <div className="mb-4 relative">
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-black"
                  >
                    New Password
                  </label>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
                    aria-label={
                      showNewPassword ? "Hide password" : "Show password"
                    }
                  >
                    <svg
                      className="h-5 w-5 text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {showNewPassword ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.79m0 0L21 21"
                        />
                      ) : (
                        <>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                <div className="mb-4 relative">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-black"
                  >
                    Confirm Password
                  </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    <svg
                      className="h-5 w-5 text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {showConfirmPassword ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.79m0 0L21 21"
                        />
                      ) : (
                        <>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                {error && (
                  <div className="mt-2 text-sm text-black">{error}</div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Submit New Password"}
                </button>
                <button
                  type="button"
                  onClick={() => setFormState("login")}
                  className="w-full py-2 px-4 mt-2 bg-gray-200 text-black font-medium rounded-md hover:bg-gray-300 focus:outline-none"
                >
                  Back to Sign In
                </button>
              </form>
            )}
          </div>
        </div>
        <div className=" hidden lg:block lg:w-1/2">
          <img
            src={banner}
            alt="Forcast.io Banner"
            className="w-full h-screen object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;

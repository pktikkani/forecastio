import React, { useState } from "react";
import logo from "../assets/logo.png";
import backgroundAuth from "../assets/background-auth.jpg";
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Button } from "../components/ui/Button";
import { TextField } from "../components/ui/TextField";

console.log(import.meta.env.VITE_API_URL,"VITE_API_URL"); // Add this to debug

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
    <div className="relative flex min-h-screen shrink-0 justify-center md:px-12 lg:px-0">
      <div className="relative z-10 flex flex-1 flex-col bg-white px-4 py-10 shadow-2xl sm:justify-center md:flex-none md:px-28">
        <main className="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0">
          <div className="flex">
            <img
              src={logo}
              alt="Forcast.io Logo"
              className="h-10 w-auto"
            />
          </div>
          <h2 className="mt-20 text-lg font-semibold text-gray-900">
            {formState === "forgotPassword"
              ? "Forgot Password"
              : formState === "resetPassword"
              ? "Reset Password"
              : formState === "newPasswordRequired"
              ? "Create New Password"
              : "Sign in to your account"}
          </h2>
          <p className="mt-2 text-sm text-gray-700">
            {formState === "forgotPassword"
              ? "Enter your email to receive a verification code"
              : formState === "resetPassword"
              ? "Enter the verification code and new password"
              : formState === "newPasswordRequired"
              ? "Please enter your new password"
              : "Enter your credentials to access your account"}
          </p>
          {formState === "login" && (
            <form onSubmit={handleLoginSubmit} className="mt-10 grid grid-cols-1 gap-y-8">
              <TextField
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              <div className="relative">
                <TextField
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 top-8 pr-3 flex items-center text-sm leading-5"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                    <svg
                      className="h-5 w-5 text-gray-500"
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
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setFormState("forgotPassword")}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              {error && (
                <div className="text-sm text-red-600">{error}</div>
              )}
              <div>
                <Button type="submit" variant="solid" color="blue" className="w-full" disabled={loading}>
                  <span>
                    {loading ? "Loading..." : "Sign in"} <span aria-hidden="true">&rarr;</span>
                  </span>
                </Button>
              </div>
            </form>
          )}
          {formState === "forgotPassword" && (
            <form
              onSubmit={handleForgotPasswordSubmit}
              className="mt-10 grid grid-cols-1 gap-y-8"
            >
              <TextField
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              {error && (
                <div className="text-sm text-red-600">{error}</div>
              )}
              {successMessage && (
                <div className="text-sm text-green-600">
                  {successMessage}
                </div>
              )}
              <div className="space-y-3">
                <Button type="submit" variant="solid" color="blue" className="w-full" disabled={loading}>
                  <span>
                    {loading ? "Loading..." : "Send verification code"} <span aria-hidden="true">&rarr;</span>
                  </span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  color="slate"
                  className="w-full"
                  onClick={() => setFormState("login")}
                >
                  Back to sign in
                </Button>
              </div>
            </form>
          )}
          {formState === "resetPassword" && (
            <form
              onSubmit={handleResetPasswordSubmit}
              className="mt-10 grid grid-cols-1 gap-y-8"
            >
              <TextField
                label="Verification code"
                name="verificationCode"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter verification code"
                required
              />
              <div className="relative">
                <TextField
                  label="New password"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 top-8 pr-3 flex items-center text-sm leading-5"
                  aria-label={
                    showNewPassword ? "Hide password" : "Show password"
                  }
                >
                    <svg
                      className="h-5 w-5 text-gray-500"
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
                      className="h-5 w-5 text-gray-500"
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
                <div className="text-sm text-red-600">{error}</div>
              )}
              {successMessage && (
                <div className="text-sm text-green-600">
                  {successMessage}
                </div>
              )}
              <div className="space-y-3">
                <Button type="submit" variant="solid" color="blue" className="w-full" disabled={loading}>
                  <span>
                    {loading ? "Loading..." : "Reset password"} <span aria-hidden="true">&rarr;</span>
                  </span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  color="slate"
                  className="w-full"
                  onClick={() => setFormState("login")}
                >
                  Back to sign in
                </Button>
              </div>
            </form>
          )}
          {formState === "newPasswordRequired" && (
            <form
              onSubmit={handleNewPasswordSubmit}
              className="mt-10 grid grid-cols-1 gap-y-8"
            >
              <div className="relative">
                <TextField
                  label="New password"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 top-8 pr-3 flex items-center text-sm leading-5"
                  aria-label={
                    showNewPassword ? "Hide password" : "Show password"
                  }
                >
                    <svg
                      className="h-5 w-5 text-gray-500"
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
                      className="h-5 w-5 text-gray-500"
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
                <div className="text-sm text-red-600">{error}</div>
              )}
              <div className="space-y-3">
                <Button type="submit" variant="solid" color="blue" className="w-full" disabled={loading}>
                  <span>
                    {loading ? "Loading..." : "Set new password"} <span aria-hidden="true">&rarr;</span>
                  </span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  color="slate"
                  className="w-full"
                  onClick={() => setFormState("login")}
                >
                  Back to sign in
                </Button>
              </div>
            </form>
          )}
        </main>
      </div>
      <div className="hidden sm:contents lg:relative lg:block lg:flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={backgroundAuth}
          alt=""
        />
      </div>
    </div>
  );
};

export default Login;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../utils/const";

const LoginRegister = ({ setAdminLoggedIn }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [performing, setPerforming] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [emailOrMobile, setEmailOrMobile] = useState(""); // New state for email or mobile input
  const [showOTPFields, setShowOTPFields] = useState(false); // Flag for showing OTP fields
  const [isForgotPassword, setIsForgotPassword] = useState(false); // Flag for forgot password flow
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState(""); // State for forgot password email
  const [otpAndNewPassword, setOtpAndNewPassword] = useState({
    otp: "",
    newPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Use to navigate after login

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailOrMobileChange = (e) => {
    setEmailOrMobile(e.target.value); // Update emailOrMobile state
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      try {
        setPerforming(true);
        const response = await axios.post(`${baseUrl}admin/login`, {
          emailOrMobile, // Send emailOrMobile for login
          password: formData.password,
        });
        setMessage("Login successful!");
        localStorage.setItem("adminToken", response.data.token);
        localStorage.removeItem('vendorToken')
        setAdminLoggedIn(true)
        navigate("/admin"); // Navigate to dashboard or home page after login
      } catch (error) {
        setMessage(error.response ? error.response.data.msg : "Login failed.");
      }
    } else {
      // Handle registration API call
      try {
        setPerforming(true);
        const response = await axios.post(`${baseUrl}admin/signup`, formData);
        setMessage(response.data.msg);
        setShowOTPFields(true); // Show OTP fields after successful registration
      } catch (error) {
        setMessage(error.response ? error.response.data.msg : "Signup failed.");
      }
    }
    setPerforming(false);
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-4">
        <div className="flex w-full sm:max-w-lg lg:max-w-4xl bg-white rounded-lg shadow-md transition-all">
          {/* Left side Image */}
          {/* <div className="hidden sm:block w-1/2 h-full flex justify-center items-center bg-blue-200">
            <div className="p-1">
              {isLogin ? (
                <img
                  src={loginImg}
                  alt="Login Image"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={signUpImg}
                  alt="Signup Image"
                  className="w-full h-[72vh] object-cover"
                />
              )}
            </div>
          </div> */}
          {/* Right side Form */}
          <div className="w-full  p-6 lg:p-4">
            <div className="p-4 bg-gray-100">
              <h2 className="text-2xl lg:text-3xl font-bold text-center mb-6">
                {isLogin ? "Login Form" : "Signup Form"}
              </h2>

              <div className="flex mb-6 rounded-full overflow-hidden border border-gray-300">
                <button
                  className={`w-1/2 py-2 text-lg font-semibold transition-colors duration-200 ${isLogin
                    ? "text-white bg-gradient-to-r from-[#003580] to-[#0072e5] shadow-md"
                    : "text-gray-600 bg-white"
                    } rounded-full`}
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </button>
                <button
                  className={`w-1/2 py-2 text-lg font-semibold transition-colors duration-200 ${!isLogin
                    ? "text-white bg-gradient-to-r from-[#003580] to-[#0072e5] shadow-md"
                    : "text-gray-600 bg-white"
                    } rounded-full`}
                  onClick={() => setIsLogin(false)}
                >
                  Signup
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {isForgotPassword === "requestOtp" ? (
                  <>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-2 mb-4 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    />
                    <button
                      type="button"
                      //   onClick={handleForgotPasswordRequest}
                      className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                    >
                      Request OTP
                    </button>
                  </>
                ) : isForgotPassword === "resetPassword" ? (
                  <>
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      className="w-full px-4 py-2 mb-4 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={otpAndNewPassword.otp}
                      onChange={(e) =>
                        setOtpAndNewPassword({
                          ...otpAndNewPassword,
                          otp: e.target.value,
                        })
                      }
                    />
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full px-4 py-2 mb-4 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={otpAndNewPassword.newPassword}
                      onChange={(e) =>
                        setOtpAndNewPassword({
                          ...otpAndNewPassword,
                          newPassword: e.target.value,
                        })
                      }
                    />
                    <button
                      type="button"
                      //   onClick={handleResetPassword}
                      className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                    >
                      Reset Password
                    </button>
                  </>
                ) : isLogin ? (
                  <>
                    <input
                      type="text"
                      name="emailOrMobile"
                      placeholder="Email or Mobile"
                      className="w-full px-4 py-2 mb-4 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={emailOrMobile}
                      onChange={handleEmailOrMobileChange}
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="w-full px-4 py-2 mb-4 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.password}
                      onChange={handleChange}
                    />

                    {/* Forgot Password Link */}
                    <p
                      onClick={() => setIsForgotPassword("requestOtp")}
                      className="my-2 text-blue-500 cursor-pointer"
                    >
                      Forgot Password?
                    </p>

                    {/* Login Button */}
                    <button
                      type="submit"
                      className="w-full py-2 text-white bg-gradient-to-r from-[#003580] to-[#0072e5] rounded-lg hover:bg-blue-600"
                    >
                      {performing ? "Logging In" : "Log In"}
                    </button>
                    {/* Create Account Section */}
                    <div className="flex justify-center items-center mt-4">
                      <p className="text-gray-600">Don't have an account?</p>
                      <button
                        onClick={() => setIsLogin(false)}
                        className="text-blue-500 ml-2 font-semibold hover:text-blue-600"
                      >
                        {performing ? "Creating" : "Create Account"} Create
                        Account
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {!showOTPFields ? (
                      <>
                        {/* Signup Form Fields */}
                        <div className="flex gap-4 mb-4">
                          <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            className="w-full sm:w-1/2 px-4 py-2 mb-4 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.name}
                            onChange={handleChange}
                          />
                          {/* <input
                            type="tel"
                            onInput={(e) => {
                              e.target.value = e.target.value.replace(
                                /[^0-9]/g,
                                ""
                              ); // Allow only digits
                            }}
                            name="mobile"
                            placeholder="Mobile"
                            className="w-full sm:w-1/2 px-4 py-2 mb-4 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.mobile}
                            onChange={handleChange}
                          /> */}
                        </div>

                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          className="w-full px-4 py-2 mb-4 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.email}
                          onChange={handleChange}
                        />

                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            className="w-full px-4 py-2 mb-4 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.password}
                            onChange={handleChange}
                          />
                          <span
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-2 cursor-pointer text-xl"
                            role="button"
                            aria-label="Toggle password visibility"
                          >
                            {showPassword ? "👁️" : "🙈"}
                          </span>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 text-white bg-gradient-to-r from-[#003580] to-[#0072e5] rounded-lg hover:bg-blue-600"
                        >
                          {performing ? "Signing Up" : "Sign Up"}
                        </button>
                      </>
                    ) : (
                      <>
                        {/* OTP Fields */}
                        <input
                          type="text"
                          name="emailOtp"
                          placeholder="Enter email OTP"
                          className="w-full px-4 py-2 mb-4 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.emailOtp}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          name="mobileOtp"
                          placeholder="Enter mobile OTP"
                          className="w-full px-4 py-2 mb-4 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.mobileOtp}
                          onChange={handleChange}
                        />
                        <button
                          type="submit"
                          className="w-full py-2 text-white bg-gradient-to-r from-[#003580] to-[#0072e5] rounded-lg hover:bg-blue-600"
                        >
                          Verify OTP
                        </button>
                      </>
                    )}
                  </>
                )}
              </form>

              {message && (
                <div
                  className={`mt-4 text-center ${message.includes("failed")
                    ? "text-red-500"
                    : "text-green-500"
                    }`}
                >
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
import { useState } from "react";
import { updateUserDetails, registerUser, verifyOTP } from "../services/api";

export default function PhoneOTPComponent({ onSuccess }) {
  // NEW USER EXTRA DETAILS
  const [isNewUser, setIsNewUser] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // NORMAL OTP STATES
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState("");

  // ------------------------------------------
  // SEND OTP
  // ------------------------------------------
  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setMessage("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await registerUser(phoneNumber);
      setShowOTP(true);
      setMessage("OTP sent successfully!");
      console.log("OTP Response:", response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to send OTP. Please try again."
      );
      console.error("Send OTP Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------------------------
  // VERIFY OTP
  // ------------------------------------------
  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 4) {
      setMessage("Please enter a valid OTP");
      return;
    }

    setIsVerifying(true);
    setMessage("");

    try {
      const response = await verifyOTP(phoneNumber, otp);
      console.log("Verify Response:", response.data);
      // Save user data
      if (response.data?.user)
        localStorage.setItem("user", JSON.stringify(response.data.user));
    if (response.data?.access)
        localStorage.setItem("access_token", response.data.access);
    if (response.data?.refresh)
        localStorage.setItem("refresh_token", response.data.refresh);
    
    // Check if first login
    if (response.data?.user?.is_first_login) {
        setIsNewUser(true);
        console.log('hi')
        return; // STOP — go to name/email screen
    }
    console.log('hello')

      // Trigger global auth change & close modal
      window.dispatchEvent(new Event("authChanged"));
      if (onSuccess) onSuccess();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Invalid OTP. Please try again."
      );
      console.error("Verify OTP Error:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  // ------------------------------------------
  // SUBMIT NAME + EMAIL FOR NEW USER
  // ------------------------------------------
  const handleNewUserSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      setMessage("Please enter name and email");
      return;
    }

    setIsVerifying(true);

    try {
      const response = await updateUserDetails({
        name,
        email,
      });
      if (response.data?.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      console.log("Profile updated:", response.data);

      // Finalize login
      window.dispatchEvent(new Event("authChanged"));
      if (onSuccess) onSuccess();
    } catch (err) {
      setMessage("Could not save details, try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  // ------------------------------------------
  // RENDER
  // ------------------------------------------
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-overlay">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md animate-modal">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Phone Verification
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Enter your phone number to receive an OTP
        </p>

        {/* ---------------------- 
            STEP 1: PHONE INPUT 
        ---------------------- */}
        {!isNewUser && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="flex gap-3">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Enter phone number"
                  maxLength="10"
                  disabled={showOTP}
                  className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                />

                <button
                  onClick={handleSendOTP}
                  disabled={isLoading || showOTP}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg disabled:bg-gray-400"
                >
                  {isLoading
                    ? "Sending..."
                    : showOTP
                    ? "Sent"
                    : "Send OTP"}
                </button>
              </div>
            </div>

            {/* OTP INPUT */}
            {showOTP && (
              <div className="animate-fadeIn">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>

                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter OTP"
                  maxLength="6"
                  className="w-full px-4 py-3 border rounded-lg text-center text-2xl"
                />

                <button
                  onClick={handleVerifyOTP}
                  disabled={isVerifying}
                  className="w-full mt-4 px-6 py-3 bg-green-600 text-white rounded-lg disabled:bg-gray-400"
                >
                  {isVerifying ? "Verifying..." : "Verify OTP"}
                </button>

                <button
                  onClick={() => {
                    setShowOTP(false);
                    setOTP("");
                    setPhoneNumber("");
                    setMessage("");
                  }}
                  className="w-full mt-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg"
                >
                  Change Number
                </button>
              </div>
            )}
          </div>
        )}

        {/* ---------------------- 
            STEP 2: NAME + EMAIL INPUT 
        ---------------------- */}
        {isNewUser && (
          <div className="animate-fadeIn space-y-6">
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />

            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />

            <button
              onClick={handleNewUserSubmit}
              disabled={isVerifying}
              className="w-full mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
            >
              {isVerifying ? "Saving..." : "Continue"}
            </button>
          </div>
        )}

        {/* MESSAGE */}
        {message && (
          <div
            className={`p-4 mt-4 rounded-lg text-center ${
              message.includes("success")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { updateUserDetails } from "../services/api";
import { LogOut, User, Mail, Phone } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Listen for auth updates (ex: new login updates profile instantly)
  useEffect(() => {
    const handler = () => {
      const updated = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(updated);
      setName(updated?.name || "");
      setEmail(updated?.email || "");
    };

    window.addEventListener("authChanged", handler);
    return () => window.removeEventListener("authChanged", handler);
  }, []);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      setMessage("Name & Email cannot be empty");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const response = await updateUserDetails({ name, email });

      if (response.data?.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setUser(response.data.user);
      }

      setMessage("Profile updated successfully!");
      window.dispatchEvent(new Event("authChanged"));
    } catch (err) {
      setMessage("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.dispatchEvent(new Event("authChanged"));
    window.location.href = "/"; // Redirect to home
  };

  return (
    <div className="max-w-xl mx-auto p-8 mt-10 bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/40">

      <div className="flex flex-col items-center mb-6">
        <img
          src="/default-avatar.png"
          className="w-28 h-28 rounded-full border-4 border-purple-500 shadow-lg"
          alt="Profile"
        />

        <h1 className="text-3xl font-bold mt-4 text-gray-800">
          {user?.name || "Unnamed User"}
        </h1>

        <p className="text-gray-600 mt-1">{user?.email || "No Email Added"}</p>
      </div>

      <div className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Name
          </label>
          <div className="flex items-center gap-3 px-4 py-3 border rounded-xl bg-white/50">
            <User className="text-purple-600" />
            <input
              type="text"
              className="flex-1 bg-transparent outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Email
          </label>
          <div className="flex items-center gap-3 px-4 py-3 border rounded-xl bg-white/50">
            <Mail className="text-purple-600" />
            <input
              type="email"
              className="flex-1 bg-transparent outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
        </div>

        {/* Phone (read-only) */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Phone
          </label>
          <div className="flex items-center gap-3 px-4 py-3 border rounded-xl bg-gray-100">
            <Phone className="text-gray-500" />
            <input
              type="text"
              className="flex-1 bg-transparent outline-none"
              value={user?.phone_number || ""}
              disabled
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full py-4 text-white rounded-xl font-semibold shadow-md transition ${
            isSaving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>

        {/* Log Out */}
        <button
          onClick={logout}
          className="w-full flex justify-center items-center gap-2 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition shadow-md"
        >
          <LogOut size={18} /> Logout
        </button>

        {/* Message */}
        {message && (
          <p
            className={`text-center mt-3 font-medium ${
              message.includes("success")
                ? "text-green-700"
                : "text-red-700"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

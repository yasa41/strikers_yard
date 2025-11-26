export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="p-10 flex justify-center">
      {/* <img
        src={user?.profile_image || "/default-avatar.png"}
        className="w-32 h-32 rounded-full border shadow"
        alt="Profile"
      /> */}
      <h1 className="text-2xl font-bold text-gray-800">
        {user?.name || "Unnamed User"}
      </h1>
    </div>
  );
}

import { useEffect, useState } from "react";
import { fetchMyBookings } from "../services/api"; // <-- We'll create this below
import { Loader2 } from "lucide-react";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const res = await fetchMyBookings();
        setBookings(res.data);
      } catch (err) {
        console.error("Failed to load bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="animate-spin w-10 h-10 text-purple-600" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="py-20 text-center text-gray-600 text-xl">
        You have no bookings yet.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        My Bookings
      </h1>

      <div className="grid gap-6">
        {bookings.map((b) => (
          <div
            key={b.booking_id}
            className="bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl rounded-2xl p-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-purple-700">
                {b.service?.name}
              </h2>

              <span
                className={`px-4 py-1 rounded-full text-sm font-semibold ${
                  b.status === "paid"
                    ? "bg-green-100 text-green-700"
                    : b.status === "partial"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {b.status.toUpperCase()}
              </span>
            </div>

            <div className="mt-4 space-y-1 text-gray-700">
              <p>
                <strong>Date:</strong>{" "}
                {b.date}
              </p>
              <p>
                <strong>Time:</strong>{" "}
                {b.time_slot.start_time} - {b.time_slot.end_time}
              </p>
              <p>
                <strong>Duration:</strong> {b.duration_hours} hour(s)
              </p>
              <p>
                <strong>Payment ID:</strong>{" "}
                {b.payment_id || "Not Paid Yet"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

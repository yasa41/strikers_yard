import { useEffect, useState } from "react";
import { fetchMyBookings } from "../services/api";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Which booking is expanded?
  const [openId, setOpenId] = useState(null);

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

  const toggleOpen = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Bookings</h1>

      <div className="space-y-4">
        {bookings.map((b) => {
          const open = openId === b.booking_id;

          return (
            <div
              key={b.booking_id}
              className="bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl rounded-2xl"
            >
              {/* ===== TOP BAR (clickable) ===== */}
              <button
                onClick={() => toggleOpen(b.booking_id)}
                className="w-full flex justify-between items-center px-6 py-4 text-left"
              >
                <div>
                  <div className="text-lg font-semibold text-gray-800">
                    {b.service?.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {b.date} • {b.time_slot.start_time}
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    b.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : b.status === "partial"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {b.status.toUpperCase()}
                </span>

                {/* Chevron Icon */}
                {open ? (
                  <ChevronUp className="ml-3 text-gray-600" />
                ) : (
                  <ChevronDown className="ml-3 text-gray-600" />
                )}
              </button>

              {/* ===== EXPANDED DETAILS ===== */}
              {open && (
                <div className="px-6 pb-5 pt-1 text-gray-700 animate-fadeIn">
                  <p>
                    <strong>Date:</strong> {b.date}
                  </p>
                  <p>
                    <strong>Time:</strong> {b.time_slot.start_time} –{" "}
                    {b.time_slot.end_time}
                  </p>
                  <p>
                    <strong>Duration:</strong> {b.duration_hours} hour(s)
                  </p>
                  <p>
                    <strong>Payment ID:</strong>{" "}
                    {b.payment_id || "Not Paid Yet"}
                  </p>
                  <p>
                    <strong>Booking ID:</strong> {b.booking_id}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Smooth expand animation */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn .25s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

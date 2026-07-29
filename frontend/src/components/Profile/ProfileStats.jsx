import { Ticket, Car, CheckCircle2, Star, Leaf } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, isPlaceholder }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
      <Icon className="h-5 w-5" />
    </div>
    <p className="mt-2 text-xl font-bold text-slate-900">{value}</p>
    <p className="text-xs text-slate-500">{label}</p>
    {isPlaceholder && (
      <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-300">
        Coming soon
      </p>
    )}
  </div>
);

// Everything here except "Carbon Saved" is backed by real data already
// returned in ProfileResponse (computed from existing Booking/Ride/Review
// services - see UserController.toProfileResponse). "Carbon Saved" has no
// data source anywhere in the app yet, so it's a clearly-labeled,
// self-contained placeholder that can be swapped for a real value later
// without touching the rest of this component or its layout.
const ProfileStats = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">
        Account Statistics
      </h2>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          icon={Ticket}
          label="Total Bookings"
          value={profile.totalBookings ?? 0}
        />
        <StatCard
          icon={Car}
          label="Published Rides"
          value={profile.publishedRides ?? 0}
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed Trips"
          value={profile.completedTrips ?? 0}
        />
        <StatCard
          icon={Star}
          label="Average Rating"
          value={
            profile.averageRating != null
              ? profile.averageRating.toFixed(1)
              : "—"
          }
        />
        <StatCard icon={Leaf} label="Carbon Saved" value="—" isPlaceholder />
      </div>
    </div>
  );
};

export default ProfileStats;

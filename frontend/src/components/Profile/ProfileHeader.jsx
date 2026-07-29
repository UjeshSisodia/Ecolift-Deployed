import { Mail, Phone, CalendarClock } from "lucide-react";

const DEFAULT_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDTXEqeXb5oMyQbf1hR_m59FLXF81K1UzNc300uKHMGjM_4kHPRyedHC2m4sirqtGwkISVtDsxdYa6FnhQJ_3RY5OskpVuPlEKu6NRYsEGQjQUCILUNSbCIpi8XbIW2PqJ-_yc6nwknNGb0bDskAn4_z6sCdeCsOaRjL0zYCKJ-lgjobRKMy7Rx_xVuOq60y31HjSDwRGQR9YgsJamE6F31g2kO8CY1Zidr6cdK7inh_bkIDXD8W78fcW2GT2edMpT6Q4yGHfD4ubw";

const formatJoinedDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
};

// Pure presentation - all data comes from the profile fetched in UserProfile.jsx.
const ProfileHeader = ({ profile }) => {
  if (!profile) return null;

  const isDriver = profile.currentMode === "DRIVER";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <img
          src={profile.profilePictureUrl || DEFAULT_AVATAR}
          alt={profile.name || "Profile"}
          className="h-24 w-24 shrink-0 rounded-2xl border-4 border-white object-cover shadow-md ring-1 ring-slate-200"
        />

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center">
            <h1 className="text-2xl font-bold text-slate-900">
              {profile.name}
            </h1>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isDriver
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {isDriver ? "Driver Mode" : "Passenger Mode"}
            </span>
          </div>

          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
            <span className="flex items-center justify-center gap-1.5 sm:justify-start">
              <Mail className="h-4 w-4" />
              {profile.email}
            </span>
            <span className="flex items-center justify-center gap-1.5 sm:justify-start">
              <Phone className="h-4 w-4" />
              {profile.phone || "Not added"}
            </span>
            <span className="flex items-center justify-center gap-1.5 sm:justify-start">
              <CalendarClock className="h-4 w-4" />
              Member since {formatJoinedDate(profile.joinedDate)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between border-b border-slate-100 py-3 last:border-b-0">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="text-sm font-semibold text-slate-800">{value}</span>
  </div>
);

const AccountInfoCard = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">
        Account Information
      </h2>

      <div className="mt-3">
        <Row label="Email" value={profile.email} />
        <Row
          label="Role"
          value={profile.roles && profile.roles.length ? profile.roles.join(", ") : "—"}
        />
        <Row
          label="Current Mode"
          value={profile.currentMode === "DRIVER" ? "Driver" : "Passenger"}
        />
        <Row label="Account Created" value={formatDate(profile.joinedDate)} />
        {/*
          No "isVerified"/verification-status field exists on the User
          entity today (only Vehicle has verification). Shown as an
          explicit "Not available" row rather than inventing a status, per
          "display if available" - easy to wire up later without touching
          this component's layout.
        */}
        <Row label="Verification Status" value="Not available yet" />
      </div>
    </div>
  );
};

export default AccountInfoCard;

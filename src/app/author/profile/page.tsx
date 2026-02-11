import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default function ProfilePage() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const role = cookieStore.get("role")?.value;

  if (!token || role !== "author") redirect("/authors");

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">My Profile</h2>
      <p className="mt-1 text-sm text-gray-600">
        Update your author information.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <input
          placeholder="Full Name"
          className="w-full rounded-xl border px-4 py-3 outline-none focus:border-gray-900"
        />
        <input
          placeholder="Email"
          className="w-full rounded-xl border px-4 py-3 outline-none focus:border-gray-900"
        />
        <input
          placeholder="Phone"
          className="w-full rounded-xl border px-4 py-3 outline-none focus:border-gray-900"
        />
        <input
          placeholder="City"
          className="w-full rounded-xl border px-4 py-3 outline-none focus:border-gray-900"
        />
      </div>

      <textarea
        placeholder="Bio (about author)"
        className="mt-4 w-full rounded-xl border px-4 py-3 outline-none focus:border-gray-900"
        rows={5}
      />

      <button className="mt-5 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800">
        Save Profile
      </button>
    </div>
  );
}

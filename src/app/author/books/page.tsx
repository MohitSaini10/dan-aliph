import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default function BooksPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const role = cookieStore.get("role")?.value;

  if (!token || role !== "author") redirect("/authors");

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Books</h2>
          <p className="mt-1 text-sm text-gray-600">
            Add and manage your books.
          </p>
        </div>

        <button className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">
          + Add Book
        </button>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="border-b text-left text-sm text-gray-500">
              <th className="py-3">Title</th>
              <th>Category</th>
              <th>Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b">
              <td className="py-4 font-semibold text-gray-900">—</td>
              <td className="text-gray-700">—</td>
              <td className="text-gray-700">—</td>
              <td className="text-right">
                <button className="rounded-lg border px-3 py-1 text-sm font-medium hover:bg-gray-50">
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

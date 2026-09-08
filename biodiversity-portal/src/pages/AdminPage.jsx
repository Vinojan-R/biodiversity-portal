import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [userData, animalData] = await Promise.all([
          apiRequest("/admin/users"),
          apiRequest("/admin/animals"),
        ]);
        setUsers(userData.users);
        setAnimals(animalData.animals);
      } catch (loadError) {
        setError(loadError.message);
      }
    }

    loadData();
  }, []);

  async function toggleUser(user) {
    await apiRequest(`/admin/users/${user._id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ isActive: !user.isActive }),
    });
    window.location.reload();
  }

  async function deleteAnimal(id) {
    if (!window.confirm("Delete this animal record?")) return;
    await apiRequest(`/admin/animals/${id}`, { method: "DELETE" });
    window.location.reload();
  }

  return (
    <section className="page-section">
      <div className="page-header">
        <p>Administration</p>
        <h1>Portal control room</h1>
        <span>Review account access and keep the wildlife catalogue accurate.</span>
      </div>
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</p>}
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="overflow-x-auto rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Users ({users.length})</h2>
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b text-slate-500"><th className="py-3">Name</th><th>Email</th><th>Status</th><th /></tr></thead>
            <tbody>{users.map((user) => <tr key={user._id} className="border-b last:border-0"><td className="py-3 font-semibold">{user.name}</td><td>{user.email}</td><td>{user.isActive ? "Active" : "Suspended"}</td><td><button type="button" onClick={() => toggleUser(user)} className="font-semibold text-emerald-800 hover:underline">{user.isActive ? "Suspend" : "Restore"}</button></td></tr>)}</tbody>
          </table>
        </div>
        <div className="overflow-x-auto rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Animals ({animals.length})</h2>
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b text-slate-500"><th className="py-3">Species</th><th>Category</th><th /></tr></thead>
            <tbody>{animals.map((animal) => <tr key={animal._id} className="border-b last:border-0"><td className="py-3"><strong>{animal.commonName}</strong><span className="block text-xs italic text-slate-500">{animal.scientificName}</span></td><td>{animal.category}</td><td><button type="button" onClick={() => deleteAnimal(animal._id)} className="font-semibold text-red-700 hover:underline">Delete</button></td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default AdminPage;
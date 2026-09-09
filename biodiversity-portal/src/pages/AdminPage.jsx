import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [species, setSpecies] = useState([]);
  const [speciesForm, setSpeciesForm] = useState({ slug: "", commonName: "", scientificName: "", category: "mammals", image: "", habitat: "", region: "", description: "", conservationStatus: "", endemic: true });
  const [savingSpecies, setSavingSpecies] = useState(false);
  const [editingSpeciesId, setEditingSpeciesId] = useState("");
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [userData, animalData, speciesData, dashboardData] = await Promise.all([
          apiRequest("/admin/users"),
          apiRequest("/admin/animals"),
          apiRequest("/admin/species"),
          apiRequest("/admin/dashboard"),
        ]);
        setUsers(userData.users);
        setAnimals(animalData.animals);
        setSpecies(speciesData.data.species);
        setStats(dashboardData.data);
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

  function handleSpeciesChange(event) {
    const { name, value, type, checked } = event.target;
    setSpeciesForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  }

  async function saveSpecies(event) {
    event.preventDefault();
    setSavingSpecies(true);
    try {
      await apiRequest(editingSpeciesId ? `/admin/species/${editingSpeciesId}` : "/admin/species", { method: editingSpeciesId ? "PATCH" : "POST", body: JSON.stringify(speciesForm) });
      setEditingSpeciesId("");
      setSpeciesForm({ slug: "", commonName: "", scientificName: "", category: "mammals", image: "", habitat: "", region: "", description: "", conservationStatus: "", endemic: true });
      const response = await apiRequest("/admin/species");
      setSpecies(response.data.species);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSavingSpecies(false);
    }
  }

  function editSpecies(item) {
    setEditingSpeciesId(item._id);
    setSpeciesForm({ slug: item.slug, commonName: item.commonName, scientificName: item.scientificName, category: item.category, image: item.image || "", habitat: item.habitat || "", region: item.distribution?.region || "", description: item.description || "", conservationStatus: item.conservationStatus || "", endemic: item.endemic });
  }

  async function archiveSpecies(id) {
    if (!window.confirm("Archive this species record?")) return;
    await apiRequest(`/admin/species/${id}`, { method: "DELETE" });
    setSpecies((current) => current.filter((item) => item._id !== id));
  }

  return (
    <section className="page-section">
      <div className="page-header">
        <p>Administration</p>
        <h1>Portal control room</h1>
        <span>Review account access and keep the wildlife catalogue accurate.</span>
      </div>
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</p>}
      {stats && <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Users", stats.users], ["Active users", stats.activeUsers], ["Species", stats.species], ["Endemic species", stats.endemicSpecies], ["Observations", stats.observations], ["Pending review", stats.pendingObservations], ["Identifications", stats.identifications]].map(([label, value]) => <div key={label} className="rounded-2xl bg-emerald-950 p-5 text-white"><p className="text-sm text-emerald-200">{label}</p><p className="mt-2 text-3xl font-black">{value}</p></div>)}</div>}
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
      <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={saveSpecies} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-900">{editingSpeciesId ? "Edit species record" : "Add species record"}</h2>
          <div className="mt-4 grid gap-3">
            {[["slug", "Slug (example: sri-lanka-junglefowl)"], ["commonName", "Common name"], ["scientificName", "Scientific name"], ["image", "Image URL"], ["habitat", "Habitat"], ["region", "Sri Lankan distribution"], ["conservationStatus", "Conservation status"]].map(([name, label]) => <input key={name} name={name} value={speciesForm[name]} onChange={handleSpeciesChange} required={!["image", "habitat", "region", "conservationStatus"].includes(name)} placeholder={label} className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700" />)}
            <select name="category" value={speciesForm.category} onChange={handleSpeciesChange} className="rounded-xl border border-slate-300 px-4 py-3"><option value="mammals">Mammals</option><option value="birds">Birds</option><option value="amphibians">Amphibians</option><option value="reptiles">Reptiles</option><option value="sea-creatures">Sea creatures</option></select>
            <textarea name="description" value={speciesForm.description} onChange={handleSpeciesChange} placeholder="Description" rows="4" className="rounded-xl border border-slate-300 px-4 py-3" />
            <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="endemic" checked={speciesForm.endemic} onChange={handleSpeciesChange} /> Endemic to Sri Lanka</label>
            <button disabled={savingSpecies} className="rounded-xl bg-emerald-950 px-5 py-3 font-bold text-white disabled:opacity-50">{savingSpecies ? "Saving..." : editingSpeciesId ? "Save changes" : "Add species"}</button>
            {editingSpeciesId && <button type="button" onClick={() => { setEditingSpeciesId(""); setSpeciesForm({ slug: "", commonName: "", scientificName: "", category: "mammals", image: "", habitat: "", region: "", description: "", conservationStatus: "", endemic: true }); }} className="rounded-xl border border-slate-300 px-5 py-3 font-bold text-slate-700">Cancel editing</button>}
          </div>
        </form>
        <div className="overflow-x-auto rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Species catalogue ({species.length})</h2>
          <table className="w-full text-left text-sm"><thead><tr className="border-b text-slate-500"><th className="py-3">Species</th><th>Category</th><th /></tr></thead><tbody>{species.map((item) => <tr key={item._id} className="border-b last:border-0"><td className="py-3"><strong>{item.commonName}</strong><span className="block text-xs italic text-slate-500">{item.scientificName}</span></td><td className="capitalize">{item.category}</td><td className="whitespace-nowrap"><button type="button" onClick={() => editSpecies(item)} className="mr-3 font-semibold text-emerald-800 hover:underline">Edit</button><button type="button" onClick={() => archiveSpecies(item._id)} className="font-semibold text-red-700 hover:underline">Archive</button></td></tr>)}</tbody></table>
        </div>
      </div>
    </section>
  );
}

export default AdminPage;
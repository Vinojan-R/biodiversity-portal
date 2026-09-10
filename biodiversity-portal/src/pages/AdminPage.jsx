import { useEffect, useState } from "react";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  Shield,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";

const initialSpecies = {
  slug: "",
  commonName: "",
  scientificName: "",
  category: "mammals",
  image: "",
  habitat: "",
  region: "",
  description: "",
  conservationStatus: "",
  endemic: true,
};
const initialNews = {
  title: "",
  slug: "",
  summary: "",
  category: "Conservation",
  source: "",
  sourceUrl: "",
  status: "DRAFT",
};
const navItems = [
  ["dashboard", "Dashboard", LayoutDashboard],
  ["users", "Users", Users],
  ["species", "Species", Leaf],
  ["news", "Wildlife news", FileText],
  ["days", "Important days", CalendarDays],
  ["organizations", "Organizations", BookOpen],
  ["reviews", "Submissions & reports", ClipboardCheck],
  ["security", "Audit logs", Shield],
  ["analytics", "Analytics", BarChart3],
];

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-emerald-950 p-5 text-white">
      <p className="text-sm text-emerald-200">{label}</p>
      <p className="mt-2 text-3xl font-black">{value ?? 0}</p>
    </div>
  );
}
function TableState({ children }) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      {children}
    </div>
  );
}

function AdminPage() {
  const { user, logout } = useAuth();
  const [section, setSection] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [data, setData] = useState({
    stats: {},
    users: [],
    species: [],
    news: [],
    days: [],
    organizations: [],
    submissions: [],
    reports: [],
    logs: [],
  });
  const [speciesForm, setSpeciesForm] = useState(initialSpecies);
  const [editingSpeciesId, setEditingSpeciesId] = useState(null);
  const [speciesSearch, setSpeciesSearch] = useState("");
  const [speciesCategory, setSpeciesCategory] = useState("all");
  const [speciesEndemic, setSpeciesEndemic] = useState("all");
  const [newsForm, setNewsForm] = useState(initialNews);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      const [
        dashboard,
        summary,
        users,
        species,
        news,
        days,
        organizations,
        submissions,
        reports,
        logs,
      ] = await Promise.all([
        apiRequest("/admin/dashboard"),
        apiRequest("/admin/content-summary"),
        apiRequest("/admin/users"),
        apiRequest("/admin/species"),
        apiRequest("/admin/news"),
        apiRequest("/admin/important-days"),
        apiRequest("/admin/organizations"),
        apiRequest("/admin/submissions").catch(() => ({
          data: { submissions: [] },
        })),
        apiRequest("/admin/reports").catch(() => ({ data: { reports: [] } })),
        apiRequest("/admin/audit-logs").catch(() => ({ data: { logs: [] } })),
      ]);
      setData({
        stats: { ...dashboard.data, ...summary.data },
        users: users.users,
        species: species.data.species,
        news: news.data.news,
        days: days.data.days,
        organizations: organizations.data.organizations,
        submissions: submissions.data.submissions,
        reports: reports.data.reports,
        logs: logs.data.logs,
      });
    } catch (loadError) {
      setError(loadError.message);
    }
  }
  useEffect(() => {
    async function loadAdminData() {
      await load();
    }
    loadAdminData();
  }, []);

  async function mutate(path, options = {}) {
    setBusy(true);
    setError("");
    try {
      await apiRequest(path, options);
      await load();
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    } finally {
      setBusy(false);
    }
  }
  async function saveSpecies(event) {
    event.preventDefault();
    const path = editingSpeciesId
      ? `/admin/species/${editingSpeciesId}`
      : "/admin/species";
    const saved = await mutate(path, {
      method: editingSpeciesId ? "PATCH" : "POST",
      body: JSON.stringify(speciesForm),
    });
    if (!saved) return;
    setSpeciesForm(initialSpecies);
    setEditingSpeciesId(null);
  }
  function editSpecies(species) {
    setEditingSpeciesId(species._id);
    setSpeciesForm({
      ...initialSpecies,
      ...species,
      region: species.distribution?.region || "",
    });
    setError("");
  }
  function cancelSpeciesEdit() {
    setEditingSpeciesId(null);
    setSpeciesForm(initialSpecies);
  }
  async function deleteSpecies(species) {
    if (
      !window.confirm(
        `Archive ${species.commonName}? It will no longer appear in the public catalogue.`,
      )
    )
      return;
    await mutate(`/admin/species/${species._id}`, { method: "DELETE" });
    if (editingSpeciesId === species._id) cancelSpeciesEdit();
  }
  async function saveNews(event) {
    event.preventDefault();
    const saved = await mutate("/admin/news", {
      method: "POST",
      body: JSON.stringify(newsForm),
    });
    if (!saved) return;
    setNewsForm(initialNews);
  }
  function setForm(setter, event) {
    const { name, value, type, checked } = event.target;
    setter((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }
  const filteredSpecies = data.species.filter((species) => {
    const query = speciesSearch.trim().toLowerCase();
    const matchesSearch = !query || [species.commonName, species.scientificName, species.slug, species.habitat, species.distribution?.region].some((value) => value?.toLowerCase().includes(query));
    const matchesCategory = speciesCategory === "all" || species.category === speciesCategory;
    const matchesEndemic = speciesEndemic === "all" || String(Boolean(species.endemic)) === speciesEndemic;
    return matchesSearch && matchesCategory && matchesEndemic;
  });
  const title = navItems.find(([id]) => id === section)?.[1] || "Dashboard";

  return (
    <section className="min-h-[calc(100vh-72px)] bg-slate-100 lg:flex">
      <aside
        className={`${mobileOpen ? "block" : "hidden"} w-full shrink-0 bg-[#062f29] text-white lg:block lg:w-64`}
      >
        <div className="flex items-center justify-between border-b border-emerald-800 px-5 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">
              EndemicLens
            </p>
            <h2 className="mt-1 text-xl font-black">Admin panel</h2>
          </div>
          <button
            type="button"
            className="lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close admin menu"
          >
            <X />
          </button>
        </div>
        <nav className="space-y-1 p-3" aria-label="Admin navigation">
          {navItems.map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setSection(id);
                setMobileOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition ${section === id ? "bg-emerald-500 text-emerald-950" : "text-emerald-100 hover:bg-emerald-900"}`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
        <div className="border-t border-emerald-800 p-4 text-sm text-emerald-200">
          <p className="font-bold text-white">{user?.name}</p>
          <p>{user?.role}</p>
          <button
            type="button"
            onClick={logout}
            className="mt-4 flex items-center gap-2 font-bold text-white hover:text-emerald-300"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open admin menu"
            >
              <Menu />
            </button>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                Administration
              </p>
              <h1 className="text-2xl font-black text-slate-900">{title}</h1>
            </div>
          </div>
          <span className="hidden rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800 sm:block">
            {user?.role}
          </span>
        </header>
        <main className="p-5 md:p-8">
          {error && (
            <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}
          {section === "dashboard" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  ["Total users", data.stats.users],
                  ["Species", data.stats.species],
                  ["Endemic species", data.stats.endemicSpecies],
                  ["Published news", data.stats.publishedNews],
                  ["Pending submissions", data.stats.pendingSubmissions],
                  ["New wildlife reports", data.stats.newReports],
                  ["Important days", data.stats.importantDays],
                  ["Organizations", data.stats.organizations],
                ].map(([label, value]) => (
                  <StatCard key={label} label={label} value={value} />
                ))}
              </div>
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <TableState>
                  <div className="p-5">
                    <h2 className="text-lg font-black">Recent users</h2>
                    {data.users.slice(0, 6).map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between border-b py-3 text-sm"
                      >
                        <span className="font-bold">
                          {item.name}
                          <span className="block font-normal text-slate-500">
                            {item.email}
                          </span>
                        </span>
                        <span className="text-slate-500">{item.role}</span>
                      </div>
                    ))}
                  </div>
                </TableState>
                <TableState>
                  <div className="p-5">
                    <h2 className="text-lg font-black">Recent admin actions</h2>
                    {data.logs.slice(0, 6).map((item) => (
                      <div key={item._id} className="border-b py-3 text-sm">
                        <span className="font-bold">{item.action}</span>
                        <span className="ml-2 text-slate-500">
                          {item.targetType}
                        </span>
                      </div>
                    ))}
                    {!data.logs.length && (
                      <p className="py-6 text-sm text-slate-500">
                        No audit activity yet.
                      </p>
                    )}
                  </div>
                </TableState>
              </div>
            </>
          )}
          {section === "users" && (
            <TableState>
              <div className="p-5">
                <h2 className="mb-4 text-lg font-black">User management</h2>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b text-slate-500">
                      <th className="py-3">User</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.users.map((item) => (
                      <tr key={item._id} className="border-b">
                        <td className="py-3">
                          <strong>{item.name}</strong>
                          <span className="block text-slate-500">
                            {item.email}
                          </span>
                        </td>
                        <td>{item.role}</td>
                        <td>{item.isActive ? "Active" : "Suspended"}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() =>
                              mutate(`/admin/users/${item._id}/status`, {
                                method: "PATCH",
                                body: JSON.stringify({
                                  isActive: !item.isActive,
                                }),
                              })
                            }
                            className="font-bold text-emerald-800"
                          >
                            {item.isActive ? "Suspend" : "Restore"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TableState>
          )}
          {section === "species" && (
            <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
              <form
                onSubmit={saveSpecies}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-black">
                    {editingSpeciesId ? "Edit species" : "Add species"}
                  </h2>
                  {editingSpeciesId && (
                    <button
                      type="button"
                      onClick={cancelSpeciesEdit}
                      className="text-sm font-bold text-slate-500 hover:text-slate-900"
                    >
                      Cancel
                    </button>
                  )}
                </div>
                <div className="mt-4 grid gap-3">
                  {[
                    ["slug", "Slug"],
                    ["commonName", "Common name"],
                    ["scientificName", "Scientific name"],
                    ["image", "Image URL"],
                    ["habitat", "Habitat"],
                    ["region", "Distribution"],
                    ["conservationStatus", "Conservation status"],
                  ].map(([name, placeholder]) => (
                    <input
                      key={name}
                      name={name}
                      value={speciesForm[name]}
                      onChange={(event) => setForm(setSpeciesForm, event)}
                      required={[
                        "slug",
                        "commonName",
                        "scientificName",
                      ].includes(name)}
                      placeholder={placeholder}
                      className="rounded-xl border border-slate-300 px-3 py-2.5"
                    />
                  ))}
                  <select
                    name="category"
                    value={speciesForm.category}
                    onChange={(event) => setForm(setSpeciesForm, event)}
                    className="rounded-xl border border-slate-300 px-3 py-2.5"
                  >
                    <option>mammals</option>
                    <option>birds</option>
                    <option>amphibians</option>
                    <option>reptiles</option>
                    <option>sea-creatures</option>
                  </select>
                  <textarea
                    name="description"
                    value={speciesForm.description}
                    onChange={(event) => setForm(setSpeciesForm, event)}
                    placeholder="Description"
                    rows="4"
                    className="rounded-xl border border-slate-300 px-3 py-2.5"
                  />
                  <label className="text-sm font-bold">
                    <input
                      type="checkbox"
                      name="endemic"
                      checked={speciesForm.endemic}
                      onChange={(event) => setForm(setSpeciesForm, event)}
                      className="mr-2"
                    />
                    Endemic
                  </label>
                  <button
                    disabled={busy}
                    className="rounded-xl bg-emerald-950 px-4 py-3 font-bold text-white"
                  >
                    {busy
                      ? "Saving..."
                      : editingSpeciesId
                        ? "Update species"
                        : "Create species"}
                  </button>
                </div>
              </form>
              <TableState>
                <div className="p-5">
                  <h2 className="text-lg font-black">
                    Catalogue ({filteredSpecies.length} of {data.species.length})
                  </h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
                    <input
                      type="search"
                      value={speciesSearch}
                      onChange={(event) => setSpeciesSearch(event.target.value)}
                      placeholder="Search by name, slug, habitat..."
                      aria-label="Search species"
                      className="rounded-xl border border-slate-300 px-3 py-2.5"
                    />
                    <select
                      value={speciesCategory}
                      onChange={(event) => setSpeciesCategory(event.target.value)}
                      aria-label="Filter species by category"
                      className="rounded-xl border border-slate-300 px-3 py-2.5"
                    >
                      <option value="all">All categories</option>
                      <option value="mammals">Mammals</option>
                      <option value="birds">Birds</option>
                      <option value="amphibians">Amphibians</option>
                      <option value="reptiles">Reptiles</option>
                      <option value="sea-creatures">Sea creatures</option>
                    </select>
                    <select
                      value={speciesEndemic}
                      onChange={(event) => setSpeciesEndemic(event.target.value)}
                      aria-label="Filter species by endemic status"
                      className="rounded-xl border border-slate-300 px-3 py-2.5"
                    >
                      <option value="all">All statuses</option>
                      <option value="true">Endemic</option>
                      <option value="false">Non-endemic</option>
                    </select>
                  </div>
                  <div className="mt-4 divide-y">
                    {filteredSpecies.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between gap-4 py-3 text-sm"
                      >
                        <span>
                          <strong>{item.commonName}</strong>
                          <span className="block italic text-slate-500">
                            {item.scientificName}
                          </span>
                        </span>
                        <span className="flex shrink-0 items-center gap-3">
                          <span className="capitalize text-slate-500">
                            {item.category}
                          </span>
                          <button
                            type="button"
                            onClick={() => editSpecies(item)}
                            disabled={busy}
                            className="font-bold text-emerald-800 hover:text-emerald-600"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteSpecies(item)}
                            disabled={busy}
                            className="font-bold text-red-700 hover:text-red-500"
                          >
                            Delete
                          </button>
                        </span>
                      </div>
                    ))}
                    {!filteredSpecies.length && (
                      <p className="py-8 text-center text-sm text-slate-500">
                        No species match these filters.
                      </p>
                    )}
                  </div>
                </div>
              </TableState>
            </div>
          )}
          {section === "news" && (
            <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
              <form
                onSubmit={saveNews}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
              >
                <h2 className="text-lg font-black">Create sourced news</h2>
                <p className="mt-2 text-xs text-slate-500">
                  A source URL is required. Unverified content must remain
                  draft.
                </p>
                <div className="mt-4 grid gap-3">
                  {[
                    ["title", "Title"],
                    ["slug", "Slug"],
                    ["summary", "Summary"],
                    ["source", "Publisher/source"],
                    ["sourceUrl", "Source URL"],
                  ].map(([name, placeholder]) => (
                    <input
                      key={name}
                      name={name}
                      value={newsForm[name]}
                      onChange={(event) => setForm(setNewsForm, event)}
                      required
                      placeholder={placeholder}
                      className="rounded-xl border border-slate-300 px-3 py-2.5"
                    />
                  ))}
                  <select
                    name="category"
                    value={newsForm.category}
                    onChange={(event) => setForm(setNewsForm, event)}
                    className="rounded-xl border border-slate-300 px-3 py-2.5"
                  >
                    <option>Conservation</option>
                    <option>Research</option>
                    <option>Wildlife</option>
                    <option>Marine Life</option>
                    <option>Protected Areas</option>
                  </select>
                  <button
                    disabled={busy}
                    className="rounded-xl bg-emerald-950 px-4 py-3 font-bold text-white"
                  >
                    Create draft
                  </button>
                </div>
              </form>
              <TableState>
                <div className="p-5">
                  <h2 className="text-lg font-black">
                    News workflow ({data.news.length})
                  </h2>
                  {data.news.map((item) => (
                    <div
                      key={item._id}
                      className="flex flex-wrap justify-between gap-3 border-b py-4"
                    >
                      <span>
                        <strong>{item.title}</strong>
                        <span className="block text-sm text-slate-500">
                          {item.source}
                        </span>
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </TableState>
            </div>
          )}
          {section === "days" && (
            <TableState>
              <div className="p-5">
                <h2 className="text-lg font-black">
                  Important days ({data.days.length})
                </h2>
                {data.days.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between border-b py-4"
                  >
                    <span>
                      <strong>{item.name}</strong>
                      <span className="block text-sm text-slate-500">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </span>
                    <span className="text-xs font-bold">{item.status}</span>
                  </div>
                ))}
              </div>
            </TableState>
          )}
          {section === "organizations" && (
            <TableState>
              <div className="p-5">
                <h2 className="text-lg font-black">
                  Organizations ({data.organizations.length})
                </h2>
                {data.organizations.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between border-b py-4"
                  >
                    <span>
                      <strong>{item.name}</strong>
                      <span className="block text-sm text-slate-500">
                        {item.type}
                      </span>
                    </span>
                    <span className="text-xs font-bold">
                      {item.verificationStatus}
                    </span>
                  </div>
                ))}
              </div>
            </TableState>
          )}
          {section === "reviews" && (
            <div className="grid gap-6 lg:grid-cols-2">
              <TableState>
                <div className="p-5">
                  <h2 className="text-lg font-black">
                    Submissions ({data.submissions.length})
                  </h2>
                  {data.submissions.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between border-b py-4"
                    >
                      <span>
                        <strong>{item.title || item.type}</strong>
                        <span className="block text-sm text-slate-500">
                          {item.userId?.email}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          mutate(`/admin/submissions/${item._id}`, {
                            method: "PATCH",
                            body: JSON.stringify({ status: "APPROVED" }),
                          })
                        }
                        className="font-bold text-emerald-800"
                      >
                        Approve
                      </button>
                    </div>
                  ))}
                </div>
              </TableState>
              <TableState>
                <div className="p-5">
                  <h2 className="text-lg font-black">
                    Wildlife reports ({data.reports.length})
                  </h2>
                  {data.reports.map((item) => (
                    <div key={item._id} className="border-b py-4">
                      <strong>{item.category}</strong>
                      <p className="mt-1 text-sm text-slate-600">
                        {item.description}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          mutate(`/admin/reports/${item._id}`, {
                            method: "PATCH",
                            body: JSON.stringify({ status: "UNDER_REVIEW" }),
                          })
                        }
                        className="mt-2 text-sm font-bold text-emerald-800"
                      >
                        Mark under review
                      </button>
                    </div>
                  ))}
                </div>
              </TableState>
            </div>
          )}
          {section === "security" && (
            <TableState>
              <div className="p-5">
                <h2 className="text-lg font-black">Audit logs</h2>
                {data.logs.map((item) => (
                  <div key={item._id} className="border-b py-3 text-sm">
                    <strong>{item.action}</strong>
                    <span className="ml-2 text-slate-500">
                      {item.targetType} ·{" "}
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </TableState>
          )}
          {section === "analytics" && (
            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-black">Analytics foundation</h2>
              <p className="mt-3 text-slate-600">
                Usage-event collection is not enabled yet, so this area
                intentionally avoids displaying fabricated analytics.
              </p>
            </div>
          )}
        </main>
      </div>
    </section>
  );
}

export default AdminPage;

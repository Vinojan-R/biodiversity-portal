import { CalendarDays, Camera, CheckCircle2, Image, MapPin, Save, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";

const emptyForm = { name: "", username: "", bio: "", country: "", city: "", profileImageUrl: "" };

function ProfilePage() {
  const { updateUser } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [stats, setStats] = useState({});
  const [createdAt, setCreatedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await apiRequest("/users/profile");
        const profile = response.data.user;
        setForm({ ...emptyForm, ...profile });
        setStats(response.data.stats);
        setCreatedAt(profile.createdAt);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function saveProfile(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await apiRequest("/users/profile", { method: "PUT", body: JSON.stringify(form) });
      const updated = response.data.user;
      setForm({ ...emptyForm, ...updated });
      setCreatedAt(updated.createdAt || createdAt);
      updateUser(updated);
      setMessage("Profile saved successfully.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-700 border-t-transparent" /></div>;

  const statCards = [
    ["Total findings", stats.findings || 0, Image],
    ["Verified findings", stats.verifiedFindings || 0, CheckCircle2],
    ["Identified species", stats.identifiedSpecies || 0, ShieldCheck],
    ["AI analyses", stats.identifications || 0, Camera],
  ];

  return (
    <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-bold tracking-widest text-emerald-700 uppercase">Your account</p>
            <h1 className="mt-2 text-4xl font-black text-emerald-950">My profile</h1>
            <p className="mt-3 max-w-2xl leading-7 text-slate-600">Keep your contributor details current and review your wildlife activity.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-800"><ShieldCheck size={18} />Private account area</div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map(([label, value, Icon]) => <article key={label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><Icon className="text-emerald-700" size={22} /><p className="mt-5 text-sm text-slate-500">{label}</p><p className="mt-1 text-3xl font-black text-emerald-950">{value}</p></article>)}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="rounded-3xl bg-emerald-950 p-7 text-white">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-emerald-800 ring-4 ring-emerald-700">
              {form.profileImageUrl ? <img src={form.profileImageUrl} alt="Profile" className="h-full w-full object-cover" /> : <UserRound size={40} className="text-emerald-200" />}
            </div>
            <h2 className="mt-6 text-2xl font-black">{form.name || "Wildlife contributor"}</h2>
            <p className="mt-1 text-emerald-200">{form.username ? `@${form.username}` : "Add a username to personalize your profile"}</p>
            <p className="mt-6 leading-7 text-emerald-100">{form.bio || "Add a short biography to tell the community what interests you about Sri Lankan biodiversity."}</p>
            <div className="mt-8 space-y-3 text-sm text-emerald-200"><p className="flex items-center gap-2"><MapPin size={16} />{[form.city, form.country].filter(Boolean).join(", ") || "Location not added"}</p><p className="flex items-center gap-2"><CalendarDays size={16} />Joined {createdAt ? new Date(createdAt).toLocaleDateString() : "recently"}</p></div>
          </section>

          <section className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between gap-4"><div><h2 className="text-2xl font-black text-emerald-950">Personal information</h2><p className="mt-1 text-sm text-slate-500">Only you can edit these details.</p></div><UserRound className="text-emerald-700" /></div>
            <form className="mt-7 space-y-5" onSubmit={saveProfile}>
              <div className="grid gap-5 sm:grid-cols-2">
                {[['name', 'Full name'], ['username', 'Username'], ['country', 'Country'], ['city', 'City or region']].map(([name, label]) => <label key={name} className="block text-sm font-bold text-slate-700">{label}<input name={name} value={form[name]} onChange={updateField} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" /></label>)}
              </div>
              <label className="block text-sm font-bold text-slate-700">Profile image URL<input name="profileImageUrl" type="url" value={form.profileImageUrl} onChange={updateField} placeholder="https://..." className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" /></label>
              <label className="block text-sm font-bold text-slate-700">Biography<textarea name="bio" value={form.bio} onChange={updateField} rows="4" className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" /></label>
              {message && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
              {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white transition hover:bg-emerald-800 disabled:opacity-60"><Save size={18} />{saving ? "Saving..." : "Save profile"}</button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

export default ProfilePage;
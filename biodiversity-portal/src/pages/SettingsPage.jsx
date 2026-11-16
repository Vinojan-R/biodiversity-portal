import { Bell, Eye, KeyRound, Save, ShieldCheck, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

const defaultPrivacy = { profileVisible: true, findingsVisible: false, locationVisible: false };
const defaultNotifications = { emailNotifications: true, securityNotifications: true, activityNotifications: true };

function SettingsPage() {
  const [privacy, setPrivacy] = useState(defaultPrivacy);
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [expertApplication, setExpertApplication] = useState(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await apiRequest("/users/settings");
        setPrivacy({ ...defaultPrivacy, ...response.data.privacySettings });
        setNotifications({ ...defaultNotifications, ...response.data.notificationSettings });
        const applicationResponse = await apiRequest("/expert-applications/mine");
        setExpertApplication(applicationResponse.data.application);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  function toggle(setter, name) {
    setter((current) => ({ ...current, [name]: !current[name] }));
  }

  async function saveSettings(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await apiRequest("/users/settings", { method: "PUT", body: JSON.stringify({ privacySettings: privacy, notificationSettings: notifications }) });
      setMessage("Settings saved successfully.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function changePassword(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (passwords.newPassword !== passwords.confirmPassword) return setError("The new passwords do not match.");
    try {
      await apiRequest("/users/change-password", { method: "PUT", body: JSON.stringify({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }) });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage("Password changed successfully.");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-700 border-t-transparent" /></div>;

  const privacyOptions = [["profileVisible", "Public profile", "Allow other portal features to display your profile."], ["findingsVisible", "Public findings", "Make eligible findings visible to other users."], ["locationVisible", "Finding locations", "Allow location details to be shown with public findings."]];
  const notificationOptions = [["emailNotifications", "Email notifications"], ["securityNotifications", "Account security alerts"], ["activityNotifications", "Website activity updates"]];

  return <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-6 py-10"><div className="mx-auto max-w-5xl"><p className="font-bold tracking-widest text-emerald-700 uppercase">Account controls</p><h1 className="mt-2 text-4xl font-black text-emerald-950">Settings</h1><p className="mt-3 text-slate-600">Control how your account and future contributions are handled.</p>
    <form className="mt-8 grid gap-8 lg:grid-cols-2" onSubmit={saveSettings}>
      <section className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200"><div className="flex items-center gap-3"><Eye className="text-emerald-700" /><div><h2 className="text-xl font-black text-emerald-950">Privacy</h2><p className="text-sm text-slate-500">These controls apply to future public features.</p></div></div><div className="mt-6 space-y-5">{privacyOptions.map(([name, label, description]) => <label key={name} className="flex cursor-pointer items-start justify-between gap-4"><span><span className="block font-bold text-slate-800">{label}</span><span className="mt-1 block text-sm leading-6 text-slate-500">{description}</span></span><input type="checkbox" checked={privacy[name]} onChange={() => toggle(setPrivacy, name)} className="mt-1 h-5 w-5 accent-emerald-700" /></label>)}</div></section>
      <section className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200"><div className="flex items-center gap-3"><Bell className="text-emerald-700" /><div><h2 className="text-xl font-black text-emerald-950">Notifications</h2><p className="text-sm text-slate-500">Choose which updates you receive.</p></div></div><div className="mt-6 space-y-5">{notificationOptions.map(([name, label]) => <label key={name} className="flex cursor-pointer items-center justify-between gap-4 font-bold text-slate-800"><span>{label}</span><input type="checkbox" checked={notifications[name]} onChange={() => toggle(setNotifications, name)} className="h-5 w-5 accent-emerald-700" /></label>)}</div></section>
      <div className="lg:col-span-2"><button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white transition hover:bg-emerald-800 disabled:opacity-60"><Save size={18} />{saving ? "Saving..." : "Save settings"}</button></div>
    </form>
    <section className="mt-8 max-w-2xl rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200"><div className="flex items-center gap-3"><KeyRound className="text-emerald-700" /><div><h2 className="text-xl font-black text-emerald-950">Password and security</h2><p className="text-sm text-slate-500">Your current password is required. Passwords are hashed on the server.</p></div></div><form className="mt-6 space-y-4" onSubmit={changePassword}>{[["currentPassword", "Current password"], ["newPassword", "New password"], ["confirmPassword", "Confirm new password"]].map(([name, label]) => <label key={name} className="block text-sm font-bold text-slate-700">{label}<input required name={name} type="password" minLength={name === "currentPassword" ? 1 : 8} value={passwords[name]} onChange={(event) => setPasswords((current) => ({ ...current, [name]: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" /></label>)}<button type="submit" className="inline-flex items-center gap-2 rounded-xl border border-emerald-700 px-5 py-3 font-bold text-emerald-800 hover:bg-emerald-50"><ShieldCheck size={18} />Change password</button></form></section>
    <section className="mt-8 max-w-2xl rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200"><div className="flex items-center gap-3"><GraduationCap className="text-emerald-700" /><div><h2 className="text-xl font-black text-emerald-950">Expert / researcher account</h2><p className="text-sm text-slate-500">Submit qualifications for review by an authorized administrator.</p></div></div><div className="mt-5 flex flex-wrap items-center justify-between gap-4"><p className="text-sm text-slate-700">Application status: <strong>{expertApplication?.status || "Not started"}</strong></p><a href="/expert-application" className="rounded-xl bg-emerald-700 px-4 py-2 font-bold text-white hover:bg-emerald-800">{expertApplication ? "Open application" : "Apply now"}</a></div></section>
    {message && <p role="status" className="mt-6 max-w-2xl rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}{error && <p role="alert" className="mt-6 max-w-2xl rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
  </div></main>;
}

export default SettingsPage;
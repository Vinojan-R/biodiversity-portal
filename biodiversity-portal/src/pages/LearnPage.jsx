import { useMemo, useState } from "react";
import { CalendarDays, ExternalLink, LifeBuoy, Mail, MapPin, Search, ShieldAlert, TreePine } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { importantDays } from "../data/importantDays";
import { learnNews } from "../data/learnNews";
import { organizations } from "../data/organizations";
import { filterLearnContent } from "../services/learnApi";

const newsCategories = ["All", ...new Set(learnNews.map((item) => item.category))];
const helpTopics = [
  { title: "Found an injured wild animal", doText: "Keep a safe distance, reduce noise, and contact the relevant wildlife authority.", avoid: "Do not feed, move, photograph closely, or attempt treatment." },
  { title: "Wild animal near your home", doText: "Move people and pets indoors, secure food, and give the animal an unobstructed escape route.", avoid: "Do not corner, chase, provoke, or use fireworks." },
  { title: "Marine animal stranded", doText: "Keep people back, keep the animal shaded where safe, and contact a marine or wildlife authority.", avoid: "Do not push it back into the water or handle it without expert guidance." },
  { title: "Suspected illegal wildlife activity", doText: "Record only safe, non-identifying details and report through an official channel.", avoid: "Do not confront suspects or publish sensitive location details." },
];

function formatDate(value) {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

function SpeciesLinks({ ids }) {
  if (!ids?.length) return <span className="text-slate-500">No species linked yet</span>;
  return <div className="flex flex-wrap gap-2">{ids.map((id) => <Link key={id} to={`/species/${id}`} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 hover:bg-emerald-100">{id.replaceAll("-", " ")}</Link>)}</div>;
}

function LearnPage() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(searchParams.get("focus") || "news");
  const [category, setCategory] = useState("All");
  const [month, setMonth] = useState("all");
  const [sortNewest, setSortNewest] = useState(true);
  const filtered = useMemo(() => filterLearnContent({ news: learnNews, importantDays, organizations }, search), [search]);
  const visibleNews = filtered.news.filter((item) => category === "All" || item.category === category).sort((a, b) => sortNewest ? b.publishedDate.localeCompare(a.publishedDate) : a.publishedDate.localeCompare(b.publishedDate));
  const visibleDays = filtered.importantDays.filter((item) => month === "all" || item.date.slice(5, 7) === month).sort((a, b) => a.date.localeCompare(b.date));
  const tabClass = (tab) => `rounded-full px-4 py-2 text-sm font-bold transition ${activeTab === tab ? "bg-emerald-950 text-white" : "bg-white text-emerald-900 hover:bg-emerald-50"}`;

  return (
    <main className="bg-[#f6faf7] text-slate-900">
      <section className="relative overflow-hidden bg-emerald-950 px-6 py-20 text-white">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-[34px] border-emerald-800/50" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-300">Knowledge center</p>
          <h1 className="mt-4 max-w-4xl font-serif text-5xl font-black leading-tight md:text-7xl">Learn about Sri Lanka&apos;s wildlife</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-100">Explore carefully framed stories, conservation days, trusted resource links, and practical safety guidance for living alongside wildlife.</p>
          <div className="mt-9 flex max-w-2xl items-center rounded-2xl bg-white px-4 py-2 ring-4 ring-emerald-900">
            <Search className="text-slate-400" size={22} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search Learn content" placeholder="Search stories, days or organizations" className="w-full bg-transparent px-3 py-3 text-slate-900 outline-none placeholder:text-slate-400" />
          </div>
        </div>
      </section>

      <nav className="sticky top-[72px] z-20 border-b border-slate-200 bg-[#f6faf7]/95 px-6 py-4 backdrop-blur" aria-label="Learn sections">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-2">
          <button type="button" onClick={() => setActiveTab("news")} className={tabClass("news")}>Wildlife news</button>
          <button type="button" onClick={() => setActiveTab("days")} className={tabClass("days")}>Important days</button>
          <button type="button" onClick={() => setActiveTab("contacts")} className={tabClass("contacts")}>Wildlife contacts</button>
          <button type="button" onClick={() => setActiveTab("help")} className={tabClass("help")}>What to do</button>
        </div>
      </nav>

      {activeTab === "news" && <section className="mx-auto max-w-7xl px-6 py-14" id="news">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="font-bold uppercase tracking-[0.2em] text-emerald-700">Stories and context</p><h2 className="mt-2 font-serif text-4xl font-black">Wildlife &amp; biodiversity news</h2><p className="mt-3 max-w-2xl text-slate-600">These starter entries are clearly marked as learning-desk mock content. Replace them with verified editorial records through the future News API.</p></div><div className="flex gap-2"><select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter news by category" className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold">{newsCategories.map((item) => <option key={item}>{item}</option>)}</select><button type="button" onClick={() => setSortNewest((current) => !current)} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold">{sortNewest ? "Newest" : "Oldest"}</button></div></div>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">{visibleNews.map((item) => <article key={item.id} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"><img src={item.image} alt="" loading="lazy" className="h-52 w-full object-cover" /><div className="p-6"><div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-wider text-emerald-700"><span>{item.category}</span><time dateTime={item.publishedDate}>{formatDate(item.publishedDate)}</time></div><h3 className="mt-3 font-serif text-2xl font-black">{item.title}</h3><p className="mt-3 leading-7 text-slate-600">{item.summary}</p><div className="mt-5 flex items-center gap-2 text-sm text-slate-500"><MapPin size={16} />{item.location}</div><p className="mt-3 text-xs font-bold text-slate-500">Source: {item.source} · Mock learning content</p>{item.sourceUrl ? <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 font-bold text-emerald-800 hover:underline">Read more <ExternalLink size={16} /></a> : <p className="mt-5 text-sm font-semibold text-amber-700">External source pending verification</p>}</div></article>)}</div>{!visibleNews.length && <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center text-slate-500">No learning stories match your search.</div>}
      </section>}

      {activeTab === "days" && <section className="mx-auto max-w-7xl px-6 py-14" id="days"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="font-bold uppercase tracking-[0.2em] text-emerald-700">Calendar for action</p><h2 className="mt-2 font-serif text-4xl font-black">Important environmental days</h2><p className="mt-3 max-w-2xl text-slate-600">Browse observances that connect global conservation themes with Sri Lankan habitats and species.</p></div><select value={month} onChange={(event) => setMonth(event.target.value)} aria-label="Filter important days by month" className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-bold"><option value="all">All months</option>{Array.from({ length: 12 }, (_, index) => <option key={index} value={String(index + 1).padStart(2, "0")}>{new Intl.DateTimeFormat("en", { month: "long" }).format(new Date(2026, index, 1))}</option>)}</select></div><div className="mt-8 grid gap-5 md:grid-cols-2">{visibleDays.map((item) => <article key={item.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><div className="flex gap-4"><div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-emerald-950 text-center text-white"><CalendarDays size={20} /><span className="text-xs font-bold">{formatDate(item.date).split(" ").slice(0, 2).join(" ")}</span></div><div><h3 className="font-serif text-2xl font-black">{item.name}</h3><p className="mt-2 leading-7 text-slate-600">{item.description}</p></div></div><div className="mt-5 border-t border-slate-100 pt-4 text-sm"><p><strong>Why it matters:</strong> {item.importance}</p><p className="mt-3"><strong>Habitats:</strong> {item.relatedHabitats.join(", ")}</p><div className="mt-3"><strong className="block mb-2">Related species:</strong><SpeciesLinks ids={item.relatedSpecies} /></div>{item.officialUrl && <a href={item.officialUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 font-bold text-emerald-800 hover:underline">Official source <ExternalLink size={16} /></a>}</div></article>)}</div></section>}

      {activeTab === "contacts" && <section className="mx-auto max-w-7xl px-6 py-14" id="contacts"><p className="font-bold uppercase tracking-[0.2em] text-emerald-700">Trusted starting points</p><h2 className="mt-2 font-serif text-4xl font-black">Wildlife information &amp; contacts</h2><p className="mt-3 max-w-2xl text-slate-600">Official names and website links are provided as a structured starter directory. Verify phone numbers, email addresses, and emergency procedures before publishing or relying on them.</p><div className="mt-8 grid gap-5 md:grid-cols-2">{filtered.organizations.map((item) => <article key={item.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><div className="flex items-start justify-between gap-4"><div><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">{item.type}</span><h3 className="mt-4 font-serif text-2xl font-black">{item.name}</h3></div><TreePine className="text-emerald-700" /></div><p className="mt-3 leading-7 text-slate-600">{item.description}</p><ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-600">{item.services.map((service) => <li key={service}>{service}</li>)}</ul><div className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-500"><p><MapPin size={15} className="mr-2 inline" />{item.address}</p><p className="mt-2"><Mail size={15} className="mr-2 inline" />Contact details pending verification</p></div>{item.website && <a href={item.website} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 font-bold text-emerald-800 hover:underline">Visit official website <ExternalLink size={16} /></a>}</article>)}</div></section>}

      {activeTab === "help" && <section className="mx-auto max-w-7xl px-6 py-14" id="help"><p className="font-bold uppercase tracking-[0.2em] text-emerald-700">Safety first</p><h2 className="mt-2 font-serif text-4xl font-black">Wildlife help: what to do</h2><p className="mt-3 max-w-2xl text-slate-600">This general guidance cannot replace local authority instructions. Never handle dangerous wildlife yourself.</p><div className="mt-8 grid gap-5 md:grid-cols-2">{helpTopics.map((item) => <article key={item.title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><ShieldAlert className="text-amber-600" /><h3 className="mt-4 font-serif text-2xl font-black">{item.title}</h3><p className="mt-4 text-sm leading-7 text-slate-700"><strong className="text-emerald-800">Do:</strong> {item.doText}</p><p className="mt-3 text-sm leading-7 text-slate-700"><strong className="text-red-700">Do not:</strong> {item.avoid}</p><p className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm font-bold text-slate-600"><LifeBuoy size={17} />Contact the appropriate local wildlife authority.</p></article>)}</div></section>}

      <section className="border-t border-emerald-100 bg-emerald-50 px-6 py-12"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 md:flex-row md:items-center"><div><h2 className="font-serif text-3xl font-black">Keep exploring</h2><p className="mt-2 text-slate-600">Connect learning with the species catalogue and field map.</p></div><div className="flex flex-wrap gap-3"><Link to="/species" className="rounded-xl bg-emerald-950 px-5 py-3 font-bold text-white">Browse species</Link><Link to="/map" className="rounded-xl border border-emerald-800 px-5 py-3 font-bold text-emerald-900">Open map</Link></div></div></section>
    </main>
  );
}

export default LearnPage;

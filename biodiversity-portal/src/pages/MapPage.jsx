import { AlertTriangle, Filter, Layers3, LoaderCircle, MapPin, RefreshCw, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import "leaflet.heat";
import { apiRequest, buildQuery } from "../services/api";

const emptyStats = { total: 0, species: 0, mostFrequent: "None", topLocation: "None", verified: 0 };

function escapeHtml(value) {
  return String(value || "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
}

function MapPage() {
  const mapRef = useRef(null);
  const markerLayerRef = useRef(null);
  const heatLayerRef = useRef(null);
  const [species, setSpecies] = useState([]);
  const [observations, setObservations] = useState([]);
  const [stats, setStats] = useState(emptyStats);
  const [speciesId, setSpeciesId] = useState("");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("verified");
  const [category, setCategory] = useState("");
  const [endemic, setEndemic] = useState("all");
  const [view, setView] = useState("markers");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tileError, setTileError] = useState(false);

  useEffect(() => {
    const map = L.map("sri-lanka-map", { preferCanvas: true, zoomControl: true }).setView([7.8731, 80.7718], 7);
    const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap contributors", maxZoom: 19 });
    tiles.on("tileerror", () => setTileError(true));
    tiles.addTo(map);
    mapRef.current = map;
    const resize = window.setTimeout(() => map.invalidateSize(), 100);
    return () => { window.clearTimeout(resize); map.remove(); mapRef.current = null; };
  }, []);

  const loadMapData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiRequest(`/observations/map-data?${buildQuery({ speciesId, search, location, dateFrom, dateTo, verificationStatus, category, endemic })}`);
      setSpecies(response.data.species);
      setObservations(response.data.observations);
      setStats(response.data.stats);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [category, dateFrom, dateTo, endemic, location, search, speciesId, verificationStatus]);

  useEffect(() => {
    const initialLoad = window.setTimeout(loadMapData, 0);
    const interval = window.setInterval(loadMapData, 30000);
    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(interval);
    };
  }, [loadMapData]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markerLayerRef.current?.remove();
    heatLayerRef.current?.remove();
    let markerLayer;
    try {
      markerLayer = typeof L.markerClusterGroup === "function"
        ? L.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 45 })
        : L.layerGroup();
    } catch {
      markerLayer = L.layerGroup();
    }
    observations.forEach((observation) => {
      const animalName = observation.animal?.commonName || "Unidentified animal";
      const status = observation.verificationStatus === "verified" ? "Verified" : "Pending review";
      const popup = `<div style="min-width:220px"><strong>${escapeHtml(animalName)}</strong>${observation.animal?.scientificName ? `<br /><em>${escapeHtml(observation.animal.scientificName)}</em>` : ""}${observation.imageUrl ? `<img src="${escapeHtml(observation.imageUrl)}" alt="${escapeHtml(animalName)}" style="width:100%;height:100px;object-fit:cover;margin:8px 0;border-radius:8px" />` : ""}<div style="line-height:1.6"><span><b>Location:</b> ${escapeHtml(observation.location)}</span><br /><span><b>Date:</b> ${observation.observedAt ? new Date(observation.observedAt).toLocaleDateString() : "Date unavailable"}</span><br /><span><b>Status:</b> ${status}</span></div><p style="margin:8px 0">${escapeHtml(observation.description)}</p><a href="/observations/${encodeURIComponent(observation.id)}" style="display:inline-block;background:#047857;color:white;padding:6px 10px;border-radius:6px;text-decoration:none;font-weight:700">View finding</a></div>`;
      markerLayer.addLayer(L.marker([observation.latitude, observation.longitude]).bindPopup(popup));
    });
    const heatLayer = typeof L.heatLayer === "function"
      ? L.heatLayer(observations.map((item) => [item.latitude, item.longitude, 0.7]), { radius: 25, blur: 20, maxZoom: 12 })
      : markerLayer;
    markerLayerRef.current = markerLayer;
    heatLayerRef.current = heatLayer;
    if (view === "heatmap") heatLayer.addTo(map);
    else markerLayer.addTo(map);
  }, [observations, view]);

  return <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-6 py-10"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="font-bold tracking-widest text-emerald-700 uppercase">Citizen science observations</p><h1 className="mt-2 text-4xl font-black text-emerald-950">Animal density map</h1><p className="mt-3 max-w-3xl leading-7 text-slate-600">Explore verified observation records. This map represents reported observations, not animal population size.</p></div><button type="button" onClick={loadMapData} className="inline-flex items-center gap-2 self-start rounded-xl border border-emerald-700 px-4 py-3 font-bold text-emerald-800 hover:bg-emerald-50"><RefreshCw size={18} />Refresh records</button></div>
    <section className="mt-8 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><div className="flex items-center gap-2 text-lg font-black text-emerald-950"><Filter size={20} className="text-emerald-700" />Filter observations</div><div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4"><label className="text-sm font-bold text-slate-700">Animal<select value={speciesId} onChange={(event) => setSpeciesId(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal"><option value="">All animals</option>{species.map((item) => <option key={item._id} value={item._id}>{item.commonName}</option>)}</select></label><label className="text-sm font-bold text-slate-700">Search species<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Common or scientific name" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal" /></label><label className="text-sm font-bold text-slate-700">Province or district<input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Search stored location" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal" /></label><label className="text-sm font-bold text-slate-700">Verification<select value={verificationStatus} onChange={(event) => setVerificationStatus(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal"><option value="verified">Verified only</option><option value="all">All statuses</option><option value="pending">Pending review</option><option value="rejected">Rejected</option></select></label><label className="text-sm font-bold text-slate-700">Category<select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal"><option value="">All categories</option><option value="mammals">Mammals</option><option value="birds">Birds</option><option value="reptiles">Reptiles</option><option value="amphibians">Amphibians</option><option value="sea-creatures">Sea creatures</option></select></label><label className="text-sm font-bold text-slate-700">Endemic status<select value={endemic} onChange={(event) => setEndemic(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal"><option value="all">All species</option><option value="true">Endemic only</option><option value="false">Non-endemic only</option></select></label><label className="text-sm font-bold text-slate-700">From<input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal" /></label><label className="text-sm font-bold text-slate-700">To<input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal" /></label></div><div className="mt-4 flex flex-wrap items-center gap-3"><div className="inline-flex overflow-hidden rounded-xl border border-slate-300"><button type="button" onClick={() => setView("markers")} className={`px-4 py-2 text-sm font-bold ${view === "markers" ? "bg-emerald-700 text-white" : "text-slate-700"}`}><MapPin size={16} className="mr-1 inline" />Markers</button><button type="button" onClick={() => setView("heatmap")} className={`px-4 py-2 text-sm font-bold ${view === "heatmap" ? "bg-emerald-700 text-white" : "text-slate-700"}`}><Layers3 size={16} className="mr-1 inline" />Heatmap</button></div><span className="text-sm text-slate-500">Map refreshes automatically every 30 seconds</span></div></section>
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{[["Observations", stats.total], ["Species", stats.species], ["Most reported", stats.mostFrequent], ["Top location", stats.topLocation], ["Verified", stats.verified]].map(([label, value]) => <article key={label} className="rounded-2xl bg-emerald-950 p-4 text-white"><p className="text-xs text-emerald-200">{label}</p><p className="mt-2 truncate text-xl font-black">{value}</p></article>)}</div>
    {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-red-800">{error}</p>}
    <div className="relative mt-6"><div id="sri-lanka-map" className="h-[560px] overflow-hidden rounded-3xl bg-emerald-50 shadow-lg ring-1 ring-slate-200" aria-label="Verified Sri Lankan animal observation map" />{tileError && <p role="alert" className="absolute top-4 left-4 max-w-sm rounded-xl bg-white/95 p-3 text-sm text-amber-900 shadow">Map tiles could not load. Check your internet connection; observation controls remain available.</p>}{loading && <div className="absolute top-4 right-4 rounded-xl bg-white px-4 py-3 text-sm font-bold text-emerald-800 shadow"><LoaderCircle size={16} className="mr-2 inline animate-spin" />Updating map</div>}{!loading && observations.length === 0 && <div className="absolute inset-x-4 top-1/2 mx-auto max-w-sm -translate-y-1/2 rounded-2xl bg-white p-6 text-center shadow-lg"><Search className="mx-auto text-emerald-700" size={28} /><h2 className="mt-3 font-black text-emerald-950">No matching observations</h2><p className="mt-2 text-sm leading-6 text-slate-600">Try another animal or location filter. Only approved records with coordinates appear here.</p></div>}</div>
    <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-slate-500"><AlertTriangle size={17} className="mt-1 shrink-0 text-amber-600" />Public coordinates are generalized to protect sensitive wildlife locations. Do not use map records to approach wildlife or infer population size.</p>
  </div></main>;
}

export default MapPage;

import { AlertTriangle, ArrowLeft, CalendarDays, MapPin, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../services/api";

function ObservationDetailsPage() {
  const { id } = useParams();
  const [observation, setObservation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadObservation() {
      try {
        const response = await apiRequest(`/observations/${id}`);
        setObservation(response.data.observation);
      } catch (requestError) {
        setError(requestError.message);
      }
    }
    loadObservation();
  }, [id]);

  if (error) return <main className="mx-auto max-w-3xl px-6 py-16"><p role="alert" className="rounded-xl bg-red-50 p-4 text-red-800">{error}</p><Link to="/map" className="mt-5 inline-flex items-center gap-2 font-bold text-emerald-700"><ArrowLeft size={18} />Back to map</Link></main>;
  if (!observation) return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-700 border-t-transparent" /></div>;

  return <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-6 py-12"><article className="mx-auto max-w-3xl overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">{observation.imageUrl && <img src={observation.imageUrl} alt={observation.animal?.commonName || "Wildlife observation"} className="h-72 w-full object-cover" />}<div className="p-8"><Link to="/map" className="inline-flex items-center gap-2 font-bold text-emerald-700"><ArrowLeft size={18} />Back to map</Link><p className="mt-7 font-bold tracking-widest text-emerald-700 uppercase">Observation record</p><h1 className="mt-2 text-4xl font-black text-emerald-950">{observation.animal?.commonName || "Unidentified animal"}</h1>{observation.animal?.scientificName && <p className="mt-1 italic text-slate-600">{observation.animal.scientificName}</p>}<div className="mt-6 grid gap-4 sm:grid-cols-2"><p className="flex items-center gap-2 text-slate-700"><MapPin size={18} className="text-emerald-700" />{observation.location}</p><p className="flex items-center gap-2 text-slate-700"><CalendarDays size={18} className="text-emerald-700" />{observation.observedAt ? new Date(observation.observedAt).toLocaleDateString() : "Date unavailable"}</p><p className="flex items-center gap-2 font-bold text-emerald-800"><ShieldCheck size={18} />{observation.verificationStatus === "verified" ? "Verified observation" : "Pending review"}</p></div><p className="mt-7 leading-8 text-slate-600">{observation.description}</p><p className="mt-7 flex items-start gap-2 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900"><AlertTriangle size={18} className="mt-1 shrink-0" />Public coordinates are generalized for wildlife safety. Do not approach or handle animals based on this record.</p></div></article></main>;
}

export default ObservationDetailsPage;
import { AlertTriangle, ImageUp, LoaderCircle, RotateCcw, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { identifyAnimal } from "../services/api";

function IdentifyPage() {
  const maxImageBytes = 8 * 1024 * 1024;
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function selectImage(file) {
    if (!file) {
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > maxImageBytes) {
      setError("Choose a JPEG, PNG or WebP image up to 8 MB.");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError("");
  }

  function handleImageChange(event) {
    selectImage(event.target.files?.[0]);
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragActive(false);
    selectImage(event.dataTransfer.files?.[0]);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedImage) return setError("Select an image first.");
    setLoading(true);
    setError("");
    try { setResult((await identifyAnimal(selectedImage)).data); } catch (requestError) { setError(requestError.message); } finally { setLoading(false); }
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-bold tracking-widest text-emerald-700 uppercase">
          AI-assisted identification
        </p>

        <h1 className="mt-3 text-4xl font-black text-emerald-950 md:text-5xl">
          Discover Sri Lankan Wildlife
        </h1>

        <p className="mt-5 leading-8 text-slate-600">
          Identify endemic wildlife using artificial intelligence. Upload a clear photograph. Results should be treated
          as suggestions and verified by an expert.
        </p>
      </div>

      <form className="mt-12 text-center" onSubmit={handleSubmit}>
        <label
          className={`flex min-h-[400px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed p-8 transition ${dragActive ? "border-emerald-700 bg-emerald-100" : "border-emerald-400 bg-emerald-50 hover:bg-emerald-100"}`}
          onDragEnter={(event) => { event.preventDefault(); setDragActive(true); }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => { event.preventDefault(); setDragActive(false); }}
          onDrop={handleDrop}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Selected wildlife preview"
              className="max-h-[450px] w-full object-contain"
            />
          ) : (
            <>
              <ImageUp size={60} className="text-emerald-700" />

              <h2 className="mt-5 text-2xl font-bold text-emerald-950">
                Select an animal image
              </h2>

              <p className="mt-2 text-slate-600">
                Drop an image here or browse. JPG, PNG and WebP, up to 8 MB
              </p>
            </>
          )}

          <input
            type="file"
            className="hidden"
            accept="image/png,image/jpeg,image/webp"
            capture="environment"
            onChange={handleImageChange}
          />
        </label>

        {selectedImage && (
          <p className="mt-5 text-slate-600">
            Selected file: {selectedImage.name} ({Math.ceil(selectedImage.size / 1024)} KB)
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-7 py-3 font-bold text-white transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60"
        >
          {loading && <LoaderCircle size={18} className="animate-spin" />}
          {loading ? "Analysing image..." : "Identify animal"}
        </button>
        {loading && <p className="mt-3 text-sm text-slate-500" aria-live="polite">This may take a few seconds. Keep this page open.</p>}
      </form>

      {error && <p role="alert" aria-live="assertive" className="mx-auto mt-6 max-w-3xl rounded-xl bg-red-50 p-4 text-center text-red-800">{error}</p>}
      {result && <section aria-live="polite" className="mx-auto mt-10 max-w-3xl rounded-3xl border border-emerald-100 bg-white p-7 shadow-lg">
        <div className="flex items-start gap-3"><ShieldCheck className="mt-1 shrink-0 text-emerald-700" /><div><p className="font-bold tracking-widest text-emerald-700 uppercase">AI-assisted suggestion</p><h2 className="mt-2 text-3xl font-black text-emerald-950">{result.species?.commonName || result.suggestion.common_name || "No animal confidently identified"}</h2><p className="mt-1 italic text-slate-600">{result.species?.scientificName || result.suggestion.scientific_name || "No scientific name available"}</p><p className="mt-3 text-sm font-semibold text-amber-700">Status: {result.suggestion.identification_status.replaceAll("_", " ")} · Confidence estimate: {Math.round(result.suggestion.confidence * 100)}%</p></div></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2"><p><strong>Animal group:</strong> {result.suggestion.animal_group}</p><p><strong>Family:</strong> {result.suggestion.possible_family || "Not determined"}</p><p><strong>Database match:</strong> {result.matchStatus === "matched" ? "Verified in Sri Lanka Endemic Species Database" : result.matchStatus === "ambiguous" ? "Multiple possible records; not selected" : "Species not currently available in our endemic species database"}</p><p><strong>Endemic status:</strong> {result.species ? result.species.endemic ? "Verified endemic in portal record" : "Not marked endemic in portal record" : "Not verified by the portal database"}</p></div>
        {result.species && <p className="mt-5 leading-7 text-slate-600">{result.species.description || "Species information is available in the portal records."}</p>}
        {result.species && <a href={`/species/${result.species.slug}`} className="mt-5 inline-block rounded-xl bg-emerald-700 px-4 py-3 font-bold text-white hover:bg-emerald-800">View full species profile</a>}
        {!result.species && <p className="mt-5 rounded-xl bg-slate-50 p-4 leading-7 text-slate-600">The AI suggestion could not be matched to an official portal species record. No biological details have been added to fill the gap.</p>}
        {result.suggestion.visual_evidence.length > 0 && <div className="mt-6"><h3 className="font-bold text-emerald-950">Visual evidence</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-slate-600">{result.suggestion.visual_evidence.map((item) => <li key={item}>{item}</li>)}</ul></div>}
        {result.suggestion.limitations.length > 0 && <div className="mt-5"><h3 className="font-bold text-emerald-950">Limitations</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-slate-600">{result.suggestion.limitations.map((item) => <li key={item}>{item}</li>)}</ul></div>}
        <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900"><AlertTriangle className="mr-2 inline-block" size={17} />This is an AI-assisted suggestion, not scientific confirmation. Do not approach or handle suspected snakes. Seek qualified expert verification when uncertain.</div>
        <button type="button" onClick={() => { setResult(null); setSelectedImage(null); setPreviewUrl(""); }} className="mt-6 inline-flex items-center gap-2 font-bold text-emerald-700 hover:text-emerald-900"><RotateCcw size={17} />Upload another photograph</button>
      </section>}
    </section>
  );
}

export default IdentifyPage;
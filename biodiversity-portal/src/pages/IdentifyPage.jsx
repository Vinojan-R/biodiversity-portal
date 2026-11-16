import { AlertTriangle, ImageUp, LoaderCircle, RotateCcw, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { identifyAnimal } from "../services/api";

function IdentifyPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 8 * 1024 * 1024) {
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
          Identify Sri Lankan wildlife
        </h1>

        <p className="mt-5 leading-8 text-slate-600">
          Upload a clear photograph. Identification results should be treated
          as suggestions and verified by an expert.
        </p>
      </div>

      <form className="mt-12 text-center" onSubmit={handleSubmit}>
        <label className="flex min-h-[400px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-emerald-400 bg-emerald-50 p-8 transition hover:bg-emerald-100">
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
                Supported formats: JPG, PNG and WebP, up to 8 MB
              </p>
            </>
          )}

          <input
            type="file"
            className="hidden"
            accept="image/png,image/jpeg"
            onChange={handleImageChange}
          />
        </label>

        {selectedImage && (
          <p className="mt-5 text-slate-600">
            Selected file: {selectedImage.name}
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
      </form>

      {error && <p role="alert" className="mx-auto mt-6 max-w-3xl rounded-xl bg-red-50 p-4 text-center text-red-800">{error}</p>}
      {result && <section className="mx-auto mt-10 max-w-3xl rounded-3xl border border-emerald-100 bg-white p-7 shadow-lg">
        <div className="flex items-start gap-3"><ShieldCheck className="mt-1 shrink-0 text-emerald-700" /><div><p className="font-bold tracking-widest text-emerald-700 uppercase">AI-assisted suggestion</p><h2 className="mt-2 text-3xl font-black text-emerald-950">{result.species?.commonName || result.suggestion.common_name || "No confident match"}</h2><p className="mt-1 italic text-slate-600">{result.species?.scientificName || result.suggestion.scientific_name || "Species not identified"}</p></div></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2"><p><strong>Animal group:</strong> {result.suggestion.animal_group}</p><p><strong>Database match:</strong> {result.matchStatus === "matched" ? "Found in species records" : result.matchStatus === "ambiguous" ? "Multiple possible records" : "Not available"}</p></div>
        {result.species && <p className="mt-5 leading-7 text-slate-600">{result.species.description || "Species information is available in the portal records."}</p>}
        <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900"><AlertTriangle className="mr-2 inline-block" size={17} />This is an AI-assisted suggestion, not scientific confirmation. Do not approach or handle suspected snakes. Seek qualified expert verification when uncertain.</div>
        <button type="button" onClick={() => { setResult(null); setSelectedImage(null); setPreviewUrl(""); }} className="mt-6 inline-flex items-center gap-2 font-bold text-emerald-700 hover:text-emerald-900"><RotateCcw size={17} />Upload another photograph</button>
      </section>}
    </section>
  );
}

export default IdentifyPage;
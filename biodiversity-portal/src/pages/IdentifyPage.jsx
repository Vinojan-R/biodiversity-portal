import { ImageUp } from "lucide-react";
import { useEffect, useState } from "react";

function IdentifyPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

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

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!selectedImage) {
      alert("Please select an image first.");
      return;
    }

    alert("The upload interface works. The ML API will be connected later.");
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-bold tracking-widest text-emerald-700 uppercase">
          AI-assisted identification
        </p>

        <h1 className="mt-3 text-4xl font-black text-emerald-950 md:text-5xl">
          Identify an endemic lizard
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
                Supported formats: JPG, JPEG and PNG
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
          className="mt-6 rounded-xl bg-emerald-700 px-7 py-3 font-bold text-white transition hover:bg-emerald-800"
        >
          Analyse image
        </button>
      </form>
    </section>
  );
}

export default IdentifyPage;
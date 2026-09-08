import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const observations = [
  [6.9271, 80.8612, "Sri Lanka Junglefowl", "Central highlands"],
  [6.3833, 80.7833, "Purple-faced Langur", "Sinharaja region"],
  [7.2906, 80.6337, "Sri Lanka Blue Magpie", "Kandy district"],
  [8.3114, 80.4037, "Sri Lanka Grey Hornbill", "Dry zone"],
];

function MapPage() {
  useEffect(() => {
    const map = L.map("sri-lanka-map").setView([7.8731, 80.7718], 7);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
    observations.forEach(([lat, lng, species, region]) => L.marker([lat, lng]).addTo(map).bindPopup(`<strong>${species}</strong><br />${region}`));
    return () => map.remove();
  }, []);

  return (
    <section className="page-section">
      <div className="page-header">
        <p>Species distribution</p>
        <h1>Observation map</h1>
        <span>
          Interactive markers and heatmaps will be connected during the mapping
          phase.
        </span>
      </div>

      <div id="sri-lanka-map" className="mt-8 h-[520px] overflow-hidden rounded-2xl shadow-lg ring-1 ring-slate-200" aria-label="Sri Lanka species observation map" />
    </section>
  );
}

export default MapPage;
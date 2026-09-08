import "dotenv/config";
import app from "./src/app.js";
import { connectDatabase } from "./src/config/database.js";

const PORT = globalThis.process.env.PORT || 5000;

connectDatabase()
  .then(() => app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`)))
  .catch((error) => {
    console.error("Server startup failed:", error.message);
    globalThis.process.exit(1);
  });
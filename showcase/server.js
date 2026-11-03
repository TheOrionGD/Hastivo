import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  Signora Interactive Showcase & Telemetry Running`);
  console.log(`  URL: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});

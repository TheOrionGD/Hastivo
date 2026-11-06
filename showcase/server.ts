import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    agency: 'PACT.MEDIA',
    timestamp: new Date().toISOString(),
  });
});

// Project Inquiry Submission Endpoint
app.post('/api/inquiries', (req, res) => {
  const { name, email, organization, service, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  console.log(`[Pact Media Inquiry] Received from ${name} (${email}, ${organization || 'N/A'}) for ${service}`);
  return res.json({
    success: true,
    message: 'Thank you for contacting Pact Media. We will be in touch within 24 hours.',
    referenceId: `PACT-${Date.now().toString(36).toUpperCase()}`,
  });
});

// Discovery Call Booking Endpoint
app.post('/api/discovery-calls', (req, res) => {
  const { name, email, date, timeSlot, topic } = req.body;

  if (!name || !email || !date) {
    return res.status(400).json({ error: 'Name, email, and preferred date are required.' });
  }

  console.log(`[Pact Media Discovery Call] Booked by ${name} (${email}) for ${date} at ${timeSlot} regarding ${topic}`);
  return res.json({
    success: true,
    message: 'Discovery call successfully scheduled. Google Meet invitation sent.',
    bookingId: `CALL-${Date.now().toString(36).toUpperCase()}`,
  });
});

// Dev or Production Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Pact Media app running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

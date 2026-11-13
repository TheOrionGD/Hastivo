/**
 * Hastivo Database Architecture — Central MongoDB Connection Manager
 * Location: s:\Projects\Hastivo\Database\connection.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Database/.env or fallback to parent / backend .env
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '..', 'backend', '.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'hastivo';

let isConnected = false;

const connectionOptions = {
  dbName: MONGODB_DB_NAME,
  maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '50', 10),
  minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE || '5', 10),
  serverSelectionTimeoutMS: parseInt(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || '5000', 10),
  socketTimeoutMS: parseInt(process.env.MONGODB_SOCKET_TIMEOUT_MS || '45000', 10),
  autoIndex: process.env.NODE_ENV !== 'production',
};

/**
 * Connect to MongoDB instance with graceful reconnection logic.
 */
export async function connectDatabase(customUri = null) {
  const uri = customUri || MONGODB_URI;

  if (!uri || uri.includes('<password>')) {
    console.warn('[Database] MONGODB_URI is not configured or contains placeholder. Database running in pending-string mode.');
    return { connected: false, status: 'NO_URI_CONFIGURED' };
  }

  if (isConnected && mongoose.connection.readyState === 1) {
    return { connected: true, status: 'ALREADY_CONNECTED', connection: mongoose.connection };
  }

  try {
    console.log(`[Database] Connecting to MongoDB (${MONGODB_DB_NAME})...`);
    const conn = await mongoose.connect(uri, connectionOptions);
    isConnected = true;
    console.log(`[Database] Successfully connected to MongoDB: ${conn.connection.host}/${conn.connection.name}`);
    return { connected: true, status: 'CONNECTED', connection: conn.connection };
  } catch (error) {
    console.error('[Database] MongoDB connection failed:', error.message);
    isConnected = false;
    return { connected: false, status: 'ERROR', error };
  }
}

/**
 * Graceful disconnect
 */
export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('[Database] Disconnected from MongoDB.');
  }
}

// Event listeners
mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('[Database] MongoDB connection disconnected.');
});

mongoose.connection.on('error', (err) => {
  console.error('[Database] MongoDB runtime connection error:', err);
});

export default {
  connectDatabase,
  disconnectDatabase,
  mongoose
};


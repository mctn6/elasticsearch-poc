import express from 'express';
import cors from 'cors';
import * as winston from 'winston';
import * as dotenv from 'dotenv';
import searchRoutes from './routes/searchRoutes';
import { createIndex, indexSampleData } from './services/elasticsearch.service';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Logger
winston.add(new winston.transports.Console({
  format: winston.format.simple()
}));

// Routes
app.use('/api', searchRoutes);

// Health check
app.get('/health', (_, res) => {
  res.send('OK');
});

// Init Elasticsearch and start server
const startServer = async () => {
  try {
    await createIndex();
    await indexSampleData();

    app.listen(PORT, () => {
      winston.info(`✅ Server running on http://localhost:${PORT}`);
      winston.info(`🔍 Try: GET /api/search?q=iphon%20pro%20max%2015`);
    });
  } catch (error) {
    winston.error('Failed to start server:', error);
    process.exit(1);
  }
};

export default startServer;
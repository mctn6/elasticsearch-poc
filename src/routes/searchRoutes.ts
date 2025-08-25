import { Router } from 'express';
import { searchProducts } from '../services/elasticsearch.service';
import * as winston from 'winston';

const router = Router();

router.get('/search', async (req, res) => {
  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Query parameter "q" is required.' });
  }

  try {
    const results = await searchProducts(q);
    winston.info(`Search query: "${q}" -> ${results.length} results`);
    res.json({ query: q, results });
  } catch (error) {
    res.status(500).json({ error: 'Search failed.' });
  }
});

export default router;
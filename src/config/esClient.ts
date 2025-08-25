import { Client } from '@elastic/elasticsearch';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  node: process.env.ELASTICSEARCH_NODE,
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME || '',
    password: process.env.ELASTICSEARCH_PASSWORD || '',
  },
  tls: {
    rejectUnauthorized: false // Only for dev with self-signed certs
  },
  headers: {
    'accept': 'application/vnd.elasticsearch+json; compatible-with=8',
    'content-type': 'application/vnd.elasticsearch+json; compatible-with=8'
  }
});

export default client;
# Elasticsearch PoC

A simple search demo using Node.js, TypeScript, and Elasticsearch.
Search `iphon pro max 15` → returns `iPhone Pro Max 15` (with fuzzy matching).

1. Start Elasticsearch:
   ```bash
   docker-compose up -d
   ```
2. Wait for ES to start (check with curl http://localhost:9200)
3. Install and run the app:
    ```bash
    npm install 
    npm run dev
    ```
4. You will see
    ```
    info: Index products created successfully.
    info: Indexed 5 products successfully
    info: ✅ Server running on http://localhost:3000
    info: 🔍 Try: GET /api/search?q=iphon%20pro%20max%2015
    ```
5. Try to search: curl "http://localhost:3000/api/search?q=iphon+pro+max+15"

🌐 API 

    - GET /api/search?q=... – Search products

    - GET /health – Health check
     

📝 Notes 

    - Uses fuzzy search (handles typos)

    - Sample data auto-loaded

    - Runs in Docker

     
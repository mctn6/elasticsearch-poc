import client from "../config/esClient";
import { Product } from "../types/product.type";
import * as winston from "winston";

const indexName = process.env.INDEX_NAME || "products";

// Create index with mapping
export const createIndex = async (): Promise<void> => {
  try {
    const exists = await client.indices.exists({ index: indexName });
    if (exists) {
      await client.indices.delete({ index: indexName });
    }

    await client.indices.create({
      index: indexName,
      settings: {
        analysis: {
          analyzer: {
            custom_analyzer: {
              type: "custom",
              tokenizer: "standard",
              filter: ["lowercase", "stop"],
            },
          },
        },
      },
      mappings: {
        properties: {
          id: { type: "keyword" },
          name: { type: "text", analyzer: "custom_analyzer" },
          description: { type: "text", analyzer: "custom_analyzer" },
          price: { type: "float" },
          category: { type: "keyword" },
        },
      },
    });

    winston.info(`Index ${indexName} created successfully.`);
  } catch (error: unknown) {
    const err = error as Error;
    winston.error("Error creating index:", err.message);
    throw err; // Re-throw to handle it in the calling code
  }
};

// Index sample products
export const indexSampleData = async (): Promise<any> => {
  const products: Product[] = [
    {
      id: "1",
      name: "iPhone Pro Max 15",
      description: "Latest Apple flagship",
      price: 999,
      category: "phone",
    },
    {
      id: "2",
      name: "Samsung Galaxy S24 Ultra",
      description: "Top Android phone",
      price: 1199,
      category: "phone",
    },
    {
      id: "3",
      name: "iPad Pro 13 inch",
      price: 1099,
      category: "tablet",
      description: "Powerful tablet from Apple",
    },
    {
      id: "4",
      name: "iPhone 15 Mini",
      price: 699,
      category: "phone",
      description: "Compact iPhone",
    },
    {
      id: "5",
      name: "MacBook Pro 16",
      price: 2399,
      category: "laptop",
      description: "Professional laptop",
    },
  ];

  try {
    const operations = products.flatMap((product) => [
      { index: { _index: indexName, _id: product.id } },
      product,
    ]);

    const response = await client.bulk({ refresh: true, body: operations });

    if (response.errors) {
      throw new Error("Bulk indexing encountered errors");
    }

    winston.info(`Indexed ${products.length} products successfully`);
    return response;
  } catch (error: unknown) {
    const err = error as Error;
    winston.error("Error indexing products:", err.message);
    throw err;
  }
};

// Search function
export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const response = await client.search({
      index: indexName,
      query: {
        multi_match: {
          query,
          fields: ["name^2", "description"],
          fuzziness: "AUTO",
          operator: "and",
          minimum_should_match: "70%",
        },
      },
    });

    return response.hits.hits.map((hit) => hit._source as Product);
  } catch (error: any) {
    winston.error("Search error details:", {
      message: error.message,
      meta: error.meta?.body || error.meta,
      statusCode: error.meta?.statusCode,
      name: error.name,
    });
    throw error;
  }
};

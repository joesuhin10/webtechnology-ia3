import { MongoClient, Db } from 'mongodb';

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const options = {
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
};

async function createClient(uri: string): Promise<MongoClient> {
  const client = new MongoClient(uri, options);
  try {
    return await client.connect();
  } catch (err: any) {
    // If Atlas connection timed out (e.g. campus Wi-Fi firewall blocks port 27017), fallback to local MongoDB if available
    if (uri.startsWith('mongodb+srv://') && (err.message?.includes('timed out') || err.message?.includes('ETIMEDOUT'))) {
      console.warn('[MongoDB Notice] Atlas connection timed out (campus Wi-Fi firewall may block port 27017). Falling back to local MongoDB.');
      try {
        const localClient = new MongoClient('mongodb://127.0.0.1:27017', options);
        return await localClient.connect();
      } catch {
        throw err;
      }
    }
    throw err;
  }
}

/**
 * Returns a cached MongoClient promise.
 * In development, uses a global variable across HMR (Hot Module Replacement).
 */
export function getMongoClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>') || (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://'))) {
    throw new Error(
      'Please define a valid MONGODB_URI inside your .env.local file. Format: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority'
    );
  }

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = createClient(uri);
    }
    return global._mongoClientPromise;
  } else {
    return createClient(uri);
  }
}

/**
 * Helper to get the MongoDB database instance.
 */
export async function getMongoDb(): Promise<Db> {
  const client = await getMongoClientPromise();
  const dbName = process.env.MONGODB_DB || 'smartstation';
  return client.db(dbName);
}

/**
 * Check whether valid MongoDB credentials have been configured in .env.local.
 */
export function isMongoConfigured(): boolean {
  const uri = process.env.MONGODB_URI;
  return Boolean(
    uri &&
      !uri.includes('<username>') &&
      !uri.includes('<password>') &&
      (uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://'))
  );
}

export default getMongoDb;

import { NextResponse } from 'next/server';
import { getMongoClientPromise, isMongoConfigured } from '@/lib/mongodb';

export async function GET() {
  if (!isMongoConfigured()) {
    return NextResponse.json(
      {
        connected: false,
        message: 'MongoDB Atlas is not configured yet.',
        instructions:
          'Please set your MONGODB_URI in .env.local and replace the placeholder tokens with your real credentials.',
        sampleUri:
          'mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority',
      },
      { status: 200 }
    );
  }

  try {
    const startTime = Date.now();
    const client = await getMongoClientPromise();
    const ping = await client.db('admin').command({ ping: 1 });
    const latencyMs = Date.now() - startTime;

    const dbName = process.env.MONGODB_DB || 'smartstation';
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();

    return NextResponse.json({
      connected: true,
      latencyMs,
      ping,
      database: dbName,
      collections: collections.map((c) => c.name),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        connected: false,
        error: error.message || 'Failed to connect to MongoDB Atlas',
      },
      { status: 500 }
    );
  }
}

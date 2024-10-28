import { NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function GET() {
  try {
    await client.connect();
    const database = client.db('learnitabDatabase');
    const categories = ['internship', 'competitions', 'scholarships', 'volunteers', 'events', 'mentors'];
    let allData = [];

    for (let category of categories) {
      const collection = database.collection(category);
      const data = await collection.find({}).toArray();
      allData.push(...data.map(item => ({ ...item, category })));
    }

    return NextResponse.json(allData);
  } catch (error: any) {
    console.error('Error in /api/posts:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

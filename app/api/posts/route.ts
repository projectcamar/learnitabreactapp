import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

let client: MongoClient | null = null;

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MongoDB URI is not defined');
    }

    if (!client) {
      client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();
    }
    
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
  }
}

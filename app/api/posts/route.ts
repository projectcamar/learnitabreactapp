import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri!);

export async function GET() {
  try {
    await client.connect();
    const database = client.db('learnitabDatabase');
    const categories = ['internship', 'competitions', 'scholarships', 'volunteers', 'events', 'mentors'];
    let allData = [];

    for (let category of categories) {
      const collection = database.collection(category);
      const data = await collection.find({}).toArray();
      allData.push(...data.map((item: any) => ({ ...item, category })));
    }

    return NextResponse.json(allData);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error in /api/posts:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  } finally {
    await client.close();
  }
}

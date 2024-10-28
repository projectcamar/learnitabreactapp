import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MongoDB URI is not defined');
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    
    console.log('Connecting to MongoDB...');
    await client.connect();
    
    console.log('Connected to MongoDB, fetching data...');
    const database = client.db('learnitabDatabase');
    const categories = ['internship', 'competitions', 'scholarships', 'volunteers', 'events', 'mentors'];
    let allData = [];

    for (let category of categories) {
      const collection = database.collection(category);
      const data = await collection.find({}).toArray();
      allData.push(...data.map(item => ({ ...item, category })));
    }

    console.log(`Fetched ${allData.length} items`);
    
    return NextResponse.json(allData);
  } catch (error: any) {
    console.error('Error in /api/posts:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}

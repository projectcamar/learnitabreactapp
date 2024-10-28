import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const database = client.db('learnitabDatabase');
    const categories = ['internship', 'competitions', 'scholarships', 'volunteers', 'events', 'mentors'];
    
    const allData = await Promise.all(
      categories.map(async (category) => {
        const collection = database.collection(category);
        const data = await collection.find({}).toArray();
        return data.map(item => ({ ...item, category }));
      })
    );

    return NextResponse.json(allData.flat());
  } catch (error: any) {
    console.error('Error in /api/posts:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { MongoClient, Document } from 'mongodb';

export async function GET() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not defined');
    return NextResponse.json({ error: 'Database configuration error' }, { status: 500 });
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');  // Add logging
    
    const database = client.db('learnitabDatabase');
    const categories = ['internship', 'competitions', 'scholarships', 'mentors'];
    let allPosts: any[] = [];

    for (let category of categories) {
      const collection = database.collection(category);
      const posts = await collection.find({}).toArray();
      allPosts = [...allPosts, ...posts.map((post: Document) => ({ ...post, category }))];
    }

    // Use a Map to remove duplicates
    const uniqueMap = new Map();
    allPosts.forEach((post) => {
      const key = `${post._id}-${post.category}-${post.title}`;
      if (!uniqueMap.has(key) || post.updatedAt > uniqueMap.get(key).updatedAt) {
        uniqueMap.set(key, post);
      }
    });
    const uniquePosts = Array.from(uniqueMap.values());

    return NextResponse.json(uniquePosts);
  } catch (error: any) {
    console.error('Error in /api/posts:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  } finally {
    await client.close();
  }
}

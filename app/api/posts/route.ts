import { NextResponse } from 'next/server';
import { MongoClient, Document } from 'mongodb';

export async function GET() {
  const client = new MongoClient(process.env.MONGODB_URI as string);

  try {
    await client.connect();
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
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 });
  } finally {
    await client.close();
  }
}

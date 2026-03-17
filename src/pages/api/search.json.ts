import { getCollection } from 'astro:content';

export async function GET() {
  const researchEntries = await getCollection('research');
  
  const searchIndex = researchEntries.map(entry => ({
    slug: entry.id,
    title: entry.data.title,
    description: entry.data.description,
    author: entry.data.author,
    tags: entry.data.tags,
    body: entry.body, // Include raw body for full-text search
  }));

  return new Response(JSON.stringify(searchIndex), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

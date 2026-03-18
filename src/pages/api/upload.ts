import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

// Path to our JSON database and public upload directory
const DB_PATH = path.join(process.cwd(), 'src', 'data', 'gallery.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'gallery');

export const POST: APIRoute = async ({ request }) => {
  try {
    // Ensure the upload directory exists
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    // Parse the multipart form data
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;
    const title = formData.get('title') as string | null;
    const model = formData.get('model') as string | null;
    const theme = formData.get('theme') as string | null;
    const color = formData.get('color') as string | null || 'cyan';

    if (!imageFile || !title || !model || !theme) {
        return new Response(JSON.stringify({ error: 'Missing required fields.' }), { status: 400 });
    }

    // Convert file to buffer and securely save it
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Generate safe unique filename
    const ext = path.extname(imageFile.name) || '.jpg';
    const uniqueId = crypto.randomBytes(8).toString('hex');
    const safeFilename = `${uniqueId}${ext}`;
    
    await fs.writeFile(path.join(UPLOAD_DIR, safeFilename), buffer);

    // Read existing database
    let galleryData = [];
    try {
        const rawData = await fs.readFile(DB_PATH, 'utf-8');
        galleryData = JSON.parse(rawData);
    } catch (e) {
        // If file doesn't exist or is invalid, start fresh
        galleryData = [];
    }

    // Create the new artwork record
    const newArtwork = {
        id: uniqueId,
        title,
        model,
        theme,
        thumbnail: '⚡', // Using a generic icon for uploaded works
        fullImage: `/gallery/${safeFilename}`, // Public URL path
        color
    };

    // Prepend to database
    galleryData.unshift(newArtwork);
    
    // Save database
    await fs.writeFile(DB_PATH, JSON.stringify(galleryData, null, 2));

    return new Response(
      JSON.stringify({
        message: 'Upload successful!',
        artwork: newArtwork
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Upload error:", error);
    return new Response(
      JSON.stringify({ error: error.message || 'Server error during upload' }),
      { status: 500 }
    );
  }
};

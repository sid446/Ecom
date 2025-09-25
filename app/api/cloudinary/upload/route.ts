// pages/api/cloudinary/upload.ts (or app/api/cloudinary/upload/route.ts for App Router)
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        
        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large' }, { status: 400 });
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary using buffer
        const uploadResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: 'auto',
                    folder: 'products', // Optional: organize uploads in folders
                    transformation: [
                        { quality: 'auto' },
                        { format: 'auto' }
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        return NextResponse.json({
            success: true,
            data: uploadResponse
        });

    } catch (error) {
        console.error('Cloudinary upload error:', error);
        return NextResponse.json(
            { error: 'Upload failed', details: error.message },
            { status: 500 }
        );
    }
}

// For Pages Router (pages/api/cloudinary/upload.ts)
/*
import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import fs from 'fs';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const form = formidable({
            maxFileSize: 10 * 1024 * 1024, // 10MB
        });

        const [fields, files] = await form.parse(req);
        const file = Array.isArray(files.file) ? files.file[0] : files.file;

        if (!file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        // Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(file.filepath, {
            resource_type: 'auto',
            folder: 'products',
            transformation: [
                { quality: 'auto' },
                { format: 'auto' }
            ]
        });

        // Clean up temp file
        fs.unlinkSync(file.filepath);

        return res.status(200).json({
            success: true,
            data: uploadResponse
        });

    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ 
            error: 'Upload failed', 
            details: error.message 
        });
    }
}
*/
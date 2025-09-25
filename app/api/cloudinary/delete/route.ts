// pages/api/cloudinary/delete.ts (or app/api/cloudinary/delete/route.ts for App Router)
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function DELETE(request: NextRequest) {
    try {
        const { publicId } = await request.json();
        
        if (!publicId) {
            return NextResponse.json({ error: 'Public ID is required' }, { status: 400 });
        }

        // Delete from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);
        
        console.log('Delete result:', result);
        
        return NextResponse.json({
            success: true,
            result
        });

    } catch (error) {
        console.error('Cloudinary delete error:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json(
            { error: 'Delete failed', details: errorMessage },
            { status: 500 }
        );
    }
}

// For Pages Router (pages/api/cloudinary/delete.ts)
/*
import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { publicId } = req.body;
        
        if (!publicId) {
            return res.status(400).json({ error: 'Public ID is required' });
        }

        const result = await cloudinary.uploader.destroy(publicId);
        
        return res.status(200).json({
            success: true,
            result
        });

    } catch (error) {
        console.error('Delete error:', error);
        return res.status(500).json({ 
            error: 'Delete failed', 
            details: error.message 
        });
    }
}
*/
// --- MOCK DATA SIMPLIFIED ---
// Removed the `reviews`, `rating`, and `numOfReviews` fields to simplify the seed data
// and avoid issues with user references for now.



import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import mongoose from 'mongoose';

// --- EXPANDED MOCK DATA ---
// Added more products with diverse categories and better data structure
const sampleProducts = [
  {
    name: 'Angelic Bratz Knit Vest',
    description: 'A stylish and comfortable knit vest featuring the iconic Bratz design. Perfect for a layered look.',
    price: 1599,
    imagefront: 'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757071804/Gemini_Generated_Image_fehd9efehd9efehd_dmcvqi.png',
    imageback: 'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757091314/Gemini_Generated_Image_ffd1x4ffd1x4ffd1_zcyymg.png',
    allimages: [
      'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757071804/Gemini_Generated_Image_fehd9efehd9efehd_dmcvqi.png',
      'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757091314/Gemini_Generated_Image_ffd1x4ffd1x4ffd1_zcyymg.png'
    ],
    stock: { S: 5, M: 5, L: 3, XL: 2 },
    reviews: [],
    rating: 0,
    numOfReviews: 0,
    category: 'TShirts',
  },
  {
    name: 'Vintage Wash Graphic Tee',
    description: 'A soft, vintage-wash t-shirt with a unique front and back graphic print. Ultimate comfort and style.',
    price: 2199,
    imagefront: 'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757071806/Gemini_Generated_Image_2oqttp2oqttp2oqt_lhl4av.png',
    imageback: 'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757091512/Gemini_Generated_Image_s7q6p8s7q6p8s7q6_wubkio.png',
    allimages: [
      'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757071806/Gemini_Generated_Image_2oqttp2oqttp2oqt_lhl4av.png',
      'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757091512/Gemini_Generated_Image_s7q6p8s7q6p8s7q6_wubkio.png'
    ],
    stock: { S: 2, M: 3, L: 3, XL: 0 },
    reviews: [],
    rating: 0,
    numOfReviews: 0,  
    category: 'TShirts',
  },
  {
    name: 'Streetwise Crew Sweatshirt',
    description: 'A heavyweight, oversized sweatshirt perfect for a relaxed, streetwise look. Features subtle embroidery.',
    price: 2999,
    imagefront: 'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757091878/Gemini_Generated_Image_nb3frdnb3frdnb3f_sazjpy.png',
    imageback: 'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757092045/Gemini_Generated_Image_wx6ownwx6ownwx6o_n2zvtv.png',
    allimages: [
      'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757091878/Gemini_Generated_Image_nb3frdnb3frdnb3f_sazjpy.png',
      'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757092045/Gemini_Generated_Image_wx6ownwx6ownwx6o_n2zvtv.png'
    ],
    stock: { S: 1, M: 2, L: 2, XL: 0 },
    reviews: [],
    rating: 0,
    numOfReviews: 0,
    category: 'SweatShirts',
  },
  {
    name: 'Urban Explorer Hoodie',
    description: 'A durable and warm hoodie designed for comfort. Features a large front pocket and adjustable hood.',
    price: 3499,
    imagefront: 'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757072077/na3_tij9c8.png',
    imageback: 'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757092198/Gemini_Generated_Image_1i45jv1i45jv1i45_jibo1h.png',
    allimages: ['https://res.cloudinary.com/db2qa9dzs/image/upload/v1757072077/na3_tij9c8.png',
      "https://res.cloudinary.com/db2qa9dzs/image/upload/v1757092198/Gemini_Generated_Image_1i45jv1i45jv1i45_jibo1h.png"],
    stock: { S: 10, M: 8, L: 5, XL: 2 },
    reviews: [],
    rating: 0,
    numOfReviews: 0,
    category: 'Hoodies',
  },
  {
    name: 'Classic Logo Tee',
    description: 'The essential logo tee. Made from 100% premium cotton for a soft feel and a classic fit.',
    price: 1599,
    imagefront: 'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757072143/na1_v7zgis.png',
    imageback: 'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757092530/Gemini_Generated_Image_d6ijpbd6ijpbd6ij_d1ayit.png',
    allimages: ['https://res.cloudinary.com/db2qa9dzs/image/upload/v1757072143/na1_v7zgis.png',
      'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757092530/Gemini_Generated_Image_d6ijpbd6ijpbd6ij_d1ayit.png'],
    stock: { S: 4, M: 4, L: 2, XL: 2 },
    reviews: [],
    rating: 0,
    numOfReviews: 0,
    category: 'TShirts',
  },
];

/**
 * POST /api/seed
 * Seeds the database with sample products
 * This endpoint should only be used in development
 */
export async function POST(request: NextRequest) {
  try {
    // Security check - only allow in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ 
        error: 'Seeding is not allowed in production environment' 
      }, { status: 403 });
    }

    await connectToDatabase();
    
    console.log('🌱 Starting database seeding process...');
    
    // Check if products already exist
    const existingProductsCount = await Product.countDocuments();
    
    if (existingProductsCount > 0) {
      console.log(`⚠️  Found ${existingProductsCount} existing products`);
      
      // Check if force parameter is provided
      const url = new URL(request.url);
      const force = url.searchParams.get('force') === 'true';
      
      if (!force) {
        return NextResponse.json({ 
          message: 'Database already contains products. Use ?force=true to clear and reseed.',
          existingCount: existingProductsCount,
          suggestion: 'Add ?force=true to the URL to clear existing data and reseed'
        }, { status: 409 });
      }
      
      // Clear existing products if force is true
      console.log('🗑️  Clearing existing products...');
      const deleteResult = await Product.deleteMany({});
      console.log(`✅ Deleted ${deleteResult.deletedCount} existing products`);
    }
    
    // Validate sample products before insertion
    console.log('🔍 Validating sample products...');
    const validProducts = [];
    const errors = [];
    
    for (let i = 0; i < sampleProducts.length; i++) {
      try {
        // Create a new product instance to validate
        const productInstance = new Product(sampleProducts[i]);
        await productInstance.validate();
        validProducts.push(sampleProducts[i]);
      } catch (validationError) { // 'validationError' is of type 'unknown' here
        // Use a type guard to check if it's a Mongoose ValidationError
        if (validationError instanceof mongoose.Error.ValidationError) {
          console.error(`❌ Validation failed for product ${i + 1}:`, validationError.message);
          errors.push({
            productIndex: i + 1,
            productName: sampleProducts[i].name,
            error: validationError.message
          });
        } else {
          // Handle other potential errors during validation (e.g., non-Mongoose errors)
          const errorMessage = validationError instanceof Error ? validationError.message : 'Unknown validation error';
          console.error(`❌ An unexpected error occurred during validation for product ${i + 1}:`, errorMessage);
          errors.push({
            productIndex: i + 1,
            productName: sampleProducts[i].name,
            error: errorMessage
          });
        }
      }
    }
    
    if (errors.length > 0) {
      return NextResponse.json({ 
        error: 'Some products failed validation',
        validationErrors: errors,
        validProductsCount: validProducts.length,
        totalProductsCount: sampleProducts.length
      }, { status: 400 });
    }
    
    // Insert the validated sample products
    console.log(`📦 Inserting ${validProducts.length} sample products...`);
    const insertResult = await Product.insertMany(validProducts, { 
      ordered: false, // Continue inserting even if some fail
      rawResult: true // Get detailed insertion info
    });
    
    console.log('✅ Database seeded successfully!');
    
    // Get some statistics
    const stats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          totalStock: {
            $sum: {
              $add: ['$stock.S', '$stock.M', '$stock.L', '$stock.XL']
            }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    const totalProducts = await Product.countDocuments();
    const priceRange = await Product.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          avgPrice: { $avg: '$price' }
        }
      }
    ]);
    
    return NextResponse.json({ 
      message: 'Database seeded successfully! 🎉', 
      summary: {
        totalProducts,
        insertedCount: insertResult.insertedCount,
        categoriesBreakdown: stats,
        priceRange: priceRange[0] || { minPrice: 0, maxPrice: 0, avgPrice: 0 }
      },
      nextSteps: [
        'Visit /api/products to see all products',
        'Visit /api/products?category=tshirts to filter by category',
        'Visit your frontend to see the products in action'
      ]
    });
    
  } catch (error: any) {
    console.error('💥 Failed to seed database:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return NextResponse.json({ 
        error: 'Duplicate key error - some products may already exist',
        details: error.message,
        suggestion: 'Use ?force=true to clear existing data first'
      }, { status: 409 });
    }
    
    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(e => ({
        // The 'e' here is also of type 'unknown'
        field: e.path,
        message: e.message
      }));
      return NextResponse.json({ 
        error: 'Validation failed during seeding',
        validationErrors,
        details: error.message 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to seed database', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

/**
 * GET /api/seed
 * Returns information about the seeding endpoint
 */
export async function GET() {
  try {
    await connectToDatabase();
    
    const productCount = await Product.countDocuments();
    const categories = await Product.distinct('category');
    
    return NextResponse.json({
      message: 'Database seeding endpoint',
      currentState: {
        totalProducts: productCount,
        categories: categories,
        isEmpty: productCount === 0
      },
      usage: {
        seed: 'POST /api/seed - Seeds the database with sample products',
        forceSeed: 'POST /api/seed?force=true - Clears existing data and reseeds',
        environment: process.env.NODE_ENV
      },
      sampleData: {
        totalSampleProducts: sampleProducts.length,
        sampleCategories: [...new Set(sampleProducts.map(p => p.category))],
        priceRange: {
          min: Math.min(...sampleProducts.map(p => p.price)),
          max: Math.max(...sampleProducts.map(p => p.price))
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      error: 'Failed to get seeding information',
      details: error.message
    }, { status: 500 });
  }
}
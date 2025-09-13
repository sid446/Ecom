import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import mongoose from 'mongoose';

/**
 * GET /api/products
 * Fetches products with pagination, search, and filtering capabilities.
 * Query Params:
 * - page: The page number to fetch (default: 1)
 * - limit: The number of products per page (default: 12)
 * - search: Search term for product name or description
 * - category: Filter by category
 * - minPrice: Minimum price filter
 * - maxPrice: Maximum price filter
 * - sortBy: Sort field (name, price, stock, createdAt)
 * - sortOrder: Sort order (asc, desc)
 * - stockFilter: Stock filter (all, in-stock, low-stock, out-of-stock)
 * - all: Fetch all products (ignores pagination)
 */
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const skip = (page - 1) * limit;
    const fetchAll = searchParams.get('all') === 'true';
    
    // Search and filter parameters
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : null;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : null;
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const stockFilter = searchParams.get('stockFilter') || 'all';

    // Build query object
    let query: any = {};

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    // Price range filter
    if (minPrice !== null || maxPrice !== null) {
      query.price = {};
      if (minPrice !== null) query.price.$gte = minPrice;
      if (maxPrice !== null) query.price.$lte = maxPrice;
    }

    // Stock filter - We'll handle this in aggregation pipeline for complex stock structure
    let stockQuery: any = {};
    if (stockFilter !== 'all') {
      // Assuming stock is an object with S, M, L, XL properties
      switch (stockFilter) {
        case 'in-stock':
          stockQuery = {
            $expr: {
              $gt: [
                { $add: ['$stock.S', '$stock.M', '$stock.L', '$stock.XL'] },
                0
              ]
            }
          };
          break;
        case 'low-stock':
          stockQuery = {
            $expr: {
              $and: [
                { $gt: [{ $add: ['$stock.S', '$stock.M', '$stock.L', '$stock.XL'] }, 0] },
                { $lte: [{ $add: ['$stock.S', '$stock.M', '$stock.L', '$stock.XL'] }, 5] }
              ]
            }
          };
          break;
        case 'out-of-stock':
          stockQuery = {
            $expr: {
              $eq: [
                { $add: ['$stock.S', '$stock.M', '$stock.L', '$stock.XL'] },
                0
              ]
            }
          };
          break;
      }
    }

    // Combine queries
    if (Object.keys(stockQuery).length > 0) {
      query = { ...query, ...stockQuery };
    }

    // Build sort object
    let sortObj: any = {};
    switch (sortBy) {
      case 'name':
        sortObj.name = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'price':
        sortObj.price = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'stock':
        // Sort by total stock
        sortObj = { 
          totalStock: sortOrder === 'asc' ? 1 : -1,
          createdAt: -1 // Secondary sort
        };
        break;
      default:
        sortObj.createdAt = sortOrder === 'asc' ? 1 : -1;
    }

    let products;
    let totalProducts = 0;

    if (fetchAll) {
      // Fetch all products without pagination (for client-side filtering)
      if (sortBy === 'stock') {
        // Use aggregation pipeline for stock-based sorting
        products = await Product.aggregate([
          { $match: query },
          {
            $addFields: {
              totalStock: { $add: ['$stock.S', '$stock.M', '$stock.L', '$stock.XL'] }
            }
          },
          { $sort: sortObj },
          {
            $project: {
              totalStock: 0 // Remove the temporary field from output
            }
          }
        ]);
      } else {
        products = await Product.find(query).sort(sortObj);
      }
      totalProducts = products.length;
    } else {
      // Fetch paginated products
      if (sortBy === 'stock') {
        // Use aggregation pipeline for stock-based sorting with pagination
        const aggregationPipeline = [
          { $match: query },
          {
            $addFields: {
              totalStock: { $add: ['$stock.S', '$stock.M', '$stock.L', '$stock.XL'] }
            }
          },
          { $sort: sortObj },
          {
            $facet: {
              products: [
                { $skip: skip },
                { $limit: limit },
                {
                  $project: {
                    totalStock: 0 // Remove the temporary field from output
                  }
                }
              ],
              totalCount: [
                { $count: "count" }
              ]
            }
          }
        ];

        const result = await Product.aggregate(aggregationPipeline);
        products = result[0].products;
        totalProducts = result[0].totalCount[0]?.count || 0;
      } else {
        // Regular query with pagination
        products = await Product.find(query)
          .sort(sortObj)
          .skip(skip)
          .limit(limit);

        totalProducts = await Product.countDocuments(query);
      }
    }

    // Prepare response
    if (fetchAll) {
      // Return all products without pagination metadata
      return NextResponse.json({
        data: products,
        total: totalProducts
      });
    } else {
      // Return paginated response
      const response = {
        data: products,
        pagination: {
          total: totalProducts,
          page,
          limit,
          totalPages: Math.ceil(totalProducts / limit),
        },
        filters: {
          search,
          category,
          minPrice,
          maxPrice,
          stockFilter,
          sortBy,
          sortOrder
        }
      };

      return NextResponse.json(response);
    }
  } catch (error) {
    console.error('Failed to fetch products:', error);
    
    // Type guard to check if the error is an instance of Error
    if (error instanceof mongoose.Error.CastError) {
      return NextResponse.json({ 
        message: 'Invalid query parameters',
        error: error.message 
      }, { status: 400 });
    }
    
    // Safely access the error message
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';

    return NextResponse.json({ 
      message: 'Failed to fetch products',
      error: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error'
    }, { status: 500 });
  }
}

/**
 * POST /api/products
 * Creates a new product.
 */
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();

    // Validation: Check required fields
    const requiredFields = ['name', 'description', 'price', 'imagefront', 'imageback', 'allimages', 'stock', 'category'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        message: 'Missing required fields',
        missingFields
      }, { status: 400 });
    }

    // Validate stock structure
    if (typeof body.stock !== 'object' || 
        !body.stock.hasOwnProperty('S') || 
        !body.stock.hasOwnProperty('M') || 
        !body.stock.hasOwnProperty('L') || 
        !body.stock.hasOwnProperty('XL')) {
      return NextResponse.json({
        message: 'Invalid stock structure. Stock must contain S, M, L, XL properties'
      }, { status: 400 });
    }

    // Validate price
    if (typeof body.price !== 'number' || body.price < 0) {
      return NextResponse.json({
        message: 'Price must be a non-negative number'
      }, { status: 400 });
    }

    // Validate images array
    if (!Array.isArray(body.allimages) || body.allimages.length === 0) {
      return NextResponse.json({
        message: 'allimages must be a non-empty array'
      }, { status: 400 });
    }

    // Extract and validate fields
    const {
      name,
      description,
      price,
      imagefront,
      imageback,
      allimages,
      stock,
      category,
    } = body;

    const newProductData = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      imagefront: imagefront.trim(),
      imageback: imageback.trim(),
      allimages: allimages.map((img: string) => img.trim()),
      stock: {
        S: Number(stock.S) || 0,
        M: Number(stock.M) || 0,
        L: Number(stock.L) || 0,
        XL: Number(stock.XL) || 0,
      },
      category: category.trim(),
      reviews: [],
      rating: 0,
      numOfReviews: 0,
    };

    const product = new Product(newProductData);
    await product.save();

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);

    // Handle MongoDB duplicate key error
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json({
        message: 'Product with this name already exists'
      }, { status: 409 });
    }

    // Handle Mongoose validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map((e) => {
        // Type check 'e' to access 'path' and 'message' safely
        if (e && typeof e === 'object' && 'path' in e && 'message' in e) {
          return {
            field: e.path,
            message: e.message
          };
        }
        return { message: 'Validation error' };
      });
      return NextResponse.json({
        message: 'Validation failed',
        errors
      }, { status: 400 });
    }

    // Safely access the error message
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';

    return NextResponse.json({
      message: 'Failed to create product',
      error: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error'
    }, { status: 500 });
  } 
}
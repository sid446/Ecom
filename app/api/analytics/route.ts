import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Product } from '@/models/Product'
import Order from '@/models/Order'
import { User } from '@/models/User'

/**
 * GET /api/analytics
 * Returns comprehensive analytics data for the admin dashboard
 */
export async function GET() {
  try {
    await connectToDatabase()

    // Get current date for time-based analytics
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Basic counts
    const [totalProducts, totalOrders, totalUsers] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments()
    ])

    // Revenue analytics
    const revenueData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          averageOrderValue: { $avg: '$totalPrice' }
        }
      }
    ])

    const totalRevenue = revenueData[0]?.totalRevenue || 0
    const averageOrderValue = revenueData[0]?.averageOrderValue || 0

    // Recent orders analytics
    const recentOrdersCount = await Order.countDocuments({
      createdAt: { $gte: lastWeek }
    })

    const monthlyOrdersCount = await Order.countDocuments({
      createdAt: { $gte: lastMonth }
    })

    // Order status breakdown
    const orderStatusBreakdown = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    // Top selling products
    const topSellingProducts = await Order.aggregate([
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          totalSold: { $sum: '$orderItems.quantity' },
          totalRevenue: { $sum: { $multiply: ['$orderItems.quantity', '$orderItems.price'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      {
        $project: {
          _id: 1,
          totalSold: 1,
          totalRevenue: 1,
          name: { $arrayElemAt: ['$productInfo.name', 0] },
          image: { $arrayElemAt: ['$productInfo.imagefront', 0] }
        }
      }
    ])

    // Low stock products
    const lowStockProducts = await Product.aggregate([
      {
        $addFields: {
          totalStock: { $add: ['$stock.S', '$stock.M', '$stock.L', '$stock.XL'] }
        }
      },
      {
        $match: {
          totalStock: { $lte: 5, $gt: 0 }
        }
      },
      {
        $project: {
          name: 1,
          totalStock: 1,
          imagefront: 1,
          category: 1
        }
      },
      { $sort: { totalStock: 1 } },
      { $limit: 10 }
    ])

    // Out of stock products
    const outOfStockCount = await Product.countDocuments({
      $expr: {
        $eq: [{ $add: ['$stock.S', '$stock.M', '$stock.L', '$stock.XL'] }, 0]
      }
    })

    // Monthly revenue trend (last 6 months)
    const monthlyRevenueTrend = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalPrice' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])

    // Category performance
    const categoryPerformance = await Order.aggregate([
      { $unwind: '$orderItems' },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' },
      {
        $group: {
          _id: '$productInfo.category',
          totalSold: { $sum: '$orderItems.quantity' },
          totalRevenue: { $sum: { $multiply: ['$orderItems.quantity', '$orderItems.price'] } },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ])

    const analytics = {
      overview: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue,
        averageOrderValue,
        recentOrdersCount,
        monthlyOrdersCount,
        outOfStockCount
      },
      orderStatusBreakdown,
      topSellingProducts,
      lowStockProducts,
      monthlyRevenueTrend,
      categoryPerformance
    }

    return NextResponse.json(analytics)
  } catch (error: any) {
    console.error('Failed to fetch analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics', details: error.message },
      { status: 500 }
    )
  }
}
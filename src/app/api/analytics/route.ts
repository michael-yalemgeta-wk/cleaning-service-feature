import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [bookings, staff, services] = await Promise.all([
      prisma.booking.findMany({
        orderBy: { createdAt: 'desc' }
      }),
      prisma.staff.findMany(),
      prisma.service.findMany()
    ]);

    // Revenue Analytics
    const totalRevenue = bookings.reduce((sum: number, b: any) => {
      const payment: any = b.payment;
      if (payment?.status === 'Paid') {
        return sum + (Number(payment?.amount) || 0);
      }
      return sum;
    }, 0);

    const completedBookings = bookings.filter((b) => b.status === 'Completed');
    const completedRevenue = completedBookings.reduce((sum: number, b: any) => {
      const payment: any = b.payment;
      if (payment?.status === 'Paid') {
        return sum + (Number(payment?.amount) || 0);
      }
      return sum;
    }, 0);

    // Monthly Revenue (last 6 months)
    const monthlyRevenue = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = month.toLocaleDateString('en-US', { month: 'short' });
      const monthBookings = bookings.filter((b) => {
        const bookingDate = new Date(b.createdAt);
        return bookingDate.getMonth() === month.getMonth() && 
               bookingDate.getFullYear() === month.getFullYear();
      });
      
      const revenue = monthBookings.reduce((sum: number, b: any) => {
        const payment: any = b.payment;
         return sum + (Number(payment?.amount) || 0);
      }, 0);
      
      monthlyRevenue.push({ month: monthName, revenue });
    }

    // Service Distribution
    const serviceStats = services.map((service) => {
      const serviceBookings = bookings.filter((b) => b.service === service.title || b.service === service.id); // Handle title or ID match just in case
      const count = serviceBookings.length;
      const revenue = serviceBookings
        .reduce((sum: number, b: any) => {
            const payment: any = b.payment;
            return sum + (Number(payment?.amount) || 0)
        }, 0);
        
      return {
        id: service.id,
        name: service.title,
        count,
        revenue
      };
    });

    // Staff Performance
    const staffPerformance = staff.map((member) => {
      const assignedBookings = bookings.filter((b) => b.assignedTo === member.id);
      const completedJobs = assignedBookings.filter((b) => b.status === 'Completed').length;
      const revenue = assignedBookings.reduce((sum: number, b: any) => {
        const payment: any = b.payment;
        return sum + (Number(payment?.amount) || 0)
      }, 0);
      return {
        id: member.id,
        name: member.name,
        jobsCompleted: completedJobs,
        revenue
      };
    });

    // Customer Retention
    const uniqueCustomers = new Set(bookings.map((b) => b.email)).size;
    const repeatCustomers = bookings.reduce((acc: any, booking) => {
      const email = booking.email;
      if (email) {
          acc[email] = (acc[email] || 0) + 1;
      }
      return acc;
    }, {});
    const repeatCustomerCount = Object.values(repeatCustomers).filter((count: any) => count > 1).length;
    const retentionRate = uniqueCustomers > 0 ? (repeatCustomerCount / uniqueCustomers) * 100 : 0;

    // Demand Trends (by day of week)
    const dayOfWeekStats = Array(7).fill(0);
    bookings.forEach((b) => {
      // Use date string if available, otherwise createdAt
      const dateStr = b.date ? b.date : b.createdAt;
      const date = new Date(dateStr); 
      // Note: b.date is string YYYY-MM-DD usually, new Date() parses it.
      if (!isNaN(date.getTime())) {
          const day = date.getDay();
          dayOfWeekStats[day]++;
      }
    });

    const analytics = {
      overview: {
        totalRevenue,
        completedRevenue,
        totalBookings: bookings.length,
        completedBookings: completedBookings.length,
        uniqueCustomers,
        retentionRate: retentionRate.toFixed(1)
      },
      monthlyRevenue,
      serviceStats,
      staffPerformance,
      demandTrends: {
        byDayOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => ({
          day,
          count: dayOfWeekStats[i]
        }))
      }
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Analytics Error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

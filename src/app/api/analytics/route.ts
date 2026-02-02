import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

async function getBookings() {
  try {
    const data = await fs.readFile(path.join(process.cwd(), 'data', 'bookings.json'), 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function getStaff() {
  try {
    const data = await fs.readFile(path.join(process.cwd(), 'data', 'staff.json'), 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function getServices() {
  try {
    const data = await fs.readFile(path.join(process.cwd(), 'data', 'services.json'), 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export async function GET() {
  const bookings = await getBookings();
  const staff = await getStaff();
  const services = await getServices();

  // Revenue Analytics
  const totalRevenue = bookings.reduce((sum: number, b: any) => {
    if (b.payment?.status === 'Paid') {
      return sum + (b.payment?.amount || 0);
    }
    return sum;
  }, 0);

  const completedBookings = bookings.filter((b: any) => b.status === 'Completed');
  const completedRevenue = completedBookings.reduce((sum: number, b: any) => {
    if (b.payment?.status === 'Paid') {
      return sum + (b.payment?.amount || 0);
    }
    return sum;
  }, 0);

  // Monthly Revenue (last 6 months)
  const monthlyRevenue = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = month.toLocaleDateString('en-US', { month: 'short' });
    const monthBookings = bookings.filter((b: any) => {
      const bookingDate = new Date(b.createdAt || b.date);
      return bookingDate.getMonth() === month.getMonth() && 
             bookingDate.getFullYear() === month.getFullYear();
    });
    const revenue = monthBookings.reduce((sum: number, b: any) => sum + (b.payment?.amount || 0), 0);
    monthlyRevenue.push({ month: monthName, revenue });
  }

  // Service Distribution
  const serviceStats = services.map((service: any) => {
    const count = bookings.filter((b: any) => b.service === service.id).length;
    const revenue = bookings
      .filter((b: any) => b.service === service.id)
      .reduce((sum: number, b: any) => sum + (b.payment?.amount || 0), 0);
    return {
      id: service.id,
      name: service.title,
      count,
      revenue
    };
  });

  // Staff Performance
  const staffPerformance = staff.map((member: any) => {
    const assignedBookings = bookings.filter((b: any) => b.assignedTo === member.id);
    const completedJobs = assignedBookings.filter((b: any) => b.status === 'Completed').length;
    const revenue = assignedBookings.reduce((sum: number, b: any) => sum + (b.payment?.amount || 0), 0);
    return {
      id: member.id,
      name: member.name,
      jobsCompleted: completedJobs,
      revenue
    };
  });

  // Customer Retention
  const uniqueCustomers = new Set(bookings.map((b: any) => b.email)).size;
  const repeatCustomers = bookings.reduce((acc: any, booking: any) => {
    const email = booking.email;
    acc[email] = (acc[email] || 0) + 1;
    return acc;
  }, {});
  const repeatCustomerCount = Object.values(repeatCustomers).filter((count: any) => count > 1).length;
  const retentionRate = uniqueCustomers > 0 ? (repeatCustomerCount / uniqueCustomers) * 100 : 0;

  // Demand Trends (by day of week)
  const dayOfWeekStats = Array(7).fill(0);
  bookings.forEach((b: any) => {
    const date = new Date(b.date);
    const day = date.getDay();
    dayOfWeekStats[day]++;
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
}

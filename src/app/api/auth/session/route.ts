import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ isAuthenticated: false, user: null });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      phone?: string;
      email?: string;
    };

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        phone: true,
        email: true,
        isVerified: true,
        isNicVerified: true,
        isAdmin: true,
        isPremium: true,
        profile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ isAuthenticated: false, user: null });
    }

    return NextResponse.json({
      isAuthenticated: true,
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        isVerified: user.isVerified,
        isNicVerified: user.isNicVerified,
        isAdmin: user.isAdmin,
        isPremium: user.isPremium,
        profile: user.profile,
      },
    });
  } catch (error) {
    // Token is invalid or expired
    return NextResponse.json({ isAuthenticated: false, user: null });
  }
}

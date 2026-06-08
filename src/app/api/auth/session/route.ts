import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const decoded = verifyToken(request);

    if (!decoded) {
      return NextResponse.json({ isAuthenticated: false, user: null });
    }

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

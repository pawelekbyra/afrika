
import { NextRequest, NextResponse } from 'next/server';
import { IUser } from '@/lib/models/User';

export const admin = (handler: (req: NextRequest, user: IUser) => Promise<NextResponse>) => {
  return async (req: NextRequest, user: IUser) => {
    if (user && user.isAdmin) {
      return handler(req, user);
    } else {
      return NextResponse.json({ msg: 'Not authorized as an admin' }, { status: 401 });
    }
  };
};

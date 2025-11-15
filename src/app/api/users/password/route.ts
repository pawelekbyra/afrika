
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import User from '@/lib/models/User';

export async function PUT(req: NextRequest) {
  await dbConnect();

  try {
    const user = await verifyToken(req);

    if (!user) {
      return NextResponse.json({ msg: 'No token, authorization denied' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (await user.matchPassword(currentPassword)) {
      user.password = newPassword;
      await user.save();
      return NextResponse.json({ msg: 'Password updated' });
    } else {
      return NextResponse.json({ msg: 'Invalid credentials' }, { status: 401 });
    }
  } catch (err) {
    console.error('Błąd serwera przy zmianie hasła:', (err as Error).message);
    return NextResponse.json({ msg: 'Błąd serwera' }, { status: 500 });
  }
}

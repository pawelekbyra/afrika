
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const user = await verifyToken(req);

    if (!user) {
      return NextResponse.json({ msg: 'No token, authorization denied' }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error('Błąd serwera przy pobieraniu statusu:', (err as Error).message);
    return NextResponse.json({ msg: 'Błąd serwera' }, { status: 500 });
  }
}


import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import Donation from '@/lib/models/Donation';

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const user = await verifyToken(req);

    if (!user) {
      return NextResponse.json({ msg: 'No token, authorization denied' }, { status: 401 });
    }

    const donations = await Donation.find({ user: user._id }).sort({ createdAt: -1 });
    return NextResponse.json(donations);
  } catch (err) {
    console.error('Błąd serwera przy pobieraniu historii dotacji:', (err as Error).message);
    return NextResponse.json({ msg: 'Błąd serwera' }, { status: 500 });
  }
}

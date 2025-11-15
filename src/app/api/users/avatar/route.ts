
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import User from '@/lib/models/User';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const user = await verifyToken(req);

    if (!user) {
      return NextResponse.json({ msg: 'No token, authorization denied' }, { status: 401 });
    }

    // TODO: Implement file upload handling for serverless environment
    const avatarUrl = '/uploads/mock-avatar.png';

    user.avatar = avatarUrl;
    await user.save();

    return NextResponse.json({
      _id: user._id,
      displayName: user.displayName,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (err) {
    console.error('Błąd serwera przy przesyłaniu awatara:', (err as Error).message);
    return NextResponse.json({ msg: 'Błąd serwera' }, { status: 500 });
  }
}


import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Slide from '@/lib/models/Slide';
import Like from '@/lib/models/Like';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const user = await verifyToken(req);
    if (!user) {
      return NextResponse.json({ msg: 'No token, authorization denied' }, { status: 401 });
    }

    const slides = await Slide.find().sort({ createdAt: -1 });

    const slidesWithLikes = await Promise.all(
      slides.map(async (slide) => {
        const likeCount = await Like.countDocuments({ slide: slide._id });
        const userLike = await Like.findOne({ slide: slide._id, user: user._id });
        return {
          ...slide.toObject(),
          likes: likeCount,
          isLiked: !!userLike,
        };
      })
    );

    return NextResponse.json(slidesWithLikes);
  } catch (err) {
    console.error('Błąd podczas pobierania slajdów:', (err as Error).message);
    return NextResponse.json({ msg: 'Błąd serwera' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const user = await verifyToken(req);
    if (!user || (user as any).role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const { type, src, title, author } = await req.json();
    const newSlide = new Slide({ type, src, title, author });
    const savedSlide = await newSlide.save();
    return NextResponse.json(savedSlide, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: (err as Error).message }, { status: 400 });
  }
}

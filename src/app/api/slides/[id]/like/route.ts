
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Slide from '@/lib/models/Slide';
import Like from '@/lib/models/Like';
import { verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await dbConnect();

  try {
    const user = await verifyToken(req);
    if (!user) {
      return NextResponse.json({ msg: 'No token, authorization denied' }, { status: 401 });
    }

    const { id: slideId } = await context.params;

    const slide = await Slide.findById(slideId);
    if (!slide) {
      return NextResponse.json({ msg: 'Slajd nie został znaleziony.' }, { status: 404 });
    }

    const existingLike = await Like.findOne({ slide: slideId, user: user._id });
    if (existingLike) {
      return NextResponse.json({ msg: 'Już polubiłeś ten slajd.' }, { status: 400 });
    }

    const newLike = new Like({
      user: user._id,
      slide: slideId,
    });

    await newLike.save();
    return NextResponse.json({ msg: 'Slajd został polubiony.' }, { status: 201 });
  } catch (err) {
    console.error('Błąd podczas polubienia slajdu:', (err as Error).message);
    return NextResponse.json({ msg: 'Błąd serwera' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await dbConnect();

  try {
    const user = await verifyToken(req);
    if (!user) {
      return NextResponse.json({ msg: 'No token, authorization denied' }, { status: 401 });
    }

    const { id: slideId } = await context.params;

    const like = await Like.findOneAndDelete({ slide: slideId, user: user._id });
    if (!like) {
      return NextResponse.json({ msg: 'Nie polubiłeś tego slajdu.' }, { status: 404 });
    }

    return NextResponse.json({ msg: 'Polubienie zostało cofnięte.' });
  } catch (err) {
    console.error('Błąd podczas cofania polubienia:', (err as Error).message);
    return NextResponse.json({ msg: 'Błąd serwera' }, { status: 500 });
  }
}

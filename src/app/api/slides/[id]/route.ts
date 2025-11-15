
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Slide from '@/lib/models/Slide';
import Like from '@/lib/models/Like';
import { admin } from '@/lib/admin';

interface Params {
  params: {
    id: string;
  };
}

export const PUT = admin(async (req, user) => {
  await dbConnect();

  try {
    const { id } = req.params;
    const { type, src, title, author } = await req.json();
    const updatedSlide = await Slide.findByIdAndUpdate(
      id,
      { type, src, title, author },
      { new: true }
    );
    if (!updatedSlide) {
      return NextResponse.json({ message: 'Slide not found' }, { status: 404 });
    }
    return NextResponse.json(updatedSlide);
  } catch (err) {
    return NextResponse.json({ message: (err as Error).message }, { status: 400 });
  }
});

export const DELETE = admin(async (req, user) => {
  await dbConnect();

  try {
    const { id } = req.params;
    const deletedSlide = await Slide.findByIdAndDelete(id);
    if (!deletedSlide) {
      return NextResponse.json({ message: 'Slide not found' }, { status: 404 });
    }
    await Like.deleteMany({ slide: id });
    return NextResponse.json({ message: 'Slide removed' });
  } catch (err) {
    return NextResponse.json({ message: (err as Error).message }, { status: 500 });
  }
});

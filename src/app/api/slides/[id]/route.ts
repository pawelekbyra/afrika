
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Slide from '@/lib/models/Slide';
import Like from '@/lib/models/Like';
import { verifyToken } from '@/lib/auth';

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await dbConnect();

  try {
    const user = await verifyToken(req);
    if (!user || (user as any).role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const { id } = await context.params;
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
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await dbConnect();

  try {
    const user = await verifyToken(req);
    if (!user || (user as any).role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const deletedSlide = await Slide.findByIdAndDelete(id);
    if (!deletedSlide) {
      return NextResponse.json({ message: 'Slide not found' }, { status: 404 });
    }
    await Like.deleteMany({ slide: id });
    return NextResponse.json({ message: 'Slide removed' });
  } catch (err) {
    return NextResponse.json({ message: (err as Error).message }, { status: 500 });
  }
}

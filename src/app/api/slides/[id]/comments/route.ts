
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Comment from '@/lib/models/Comment';
import Slide from '@/lib/models/Slide';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await dbConnect();

  try {
    const { id } = await context.params;
    const comments = await Comment.find({ slide: id }).populate('author', 'displayName avatar').sort({ createdAt: 'asc' });
    return NextResponse.json(comments);
  } catch (err) {
    console.error((err as Error).message);
    return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await dbConnect();

  try {
    const user = await verifyToken(req);
    if (!user) {
      return NextResponse.json({ msg: 'No token, authorization denied' }, { status: 401 });
    }
    const { id } = await context.params;
    const slide = await Slide.findById(id);
    if (!slide) {
      return NextResponse.json({ msg: 'Slide not found' }, { status: 404 });
    }

    const { content, parent } = await req.json();

    const newComment = new Comment({
      content,
      author: user.id,
      slide: id,
      parent: parent || null,
    });

    const comment = await newComment.save();
    await comment.populate('author', 'displayName avatar');

    return NextResponse.json(comment);
  } catch (err) {
    console.error((err as Error).message);
    return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
  }
}

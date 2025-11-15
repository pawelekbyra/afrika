
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Comment from '@/lib/models/Comment';
import { verifyToken } from '@/lib/auth';
import { IComment } from '@/lib/models/interfaces';

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await dbConnect();

  try {
    const user = await verifyToken(req);
    if (!user) {
      return NextResponse.json({ msg: 'No token, authorization denied' }, { status: 401 });
    }

    const params = await context.params;
    const comment: IComment | null = await Comment.findById(params.id);

    if (!comment) {
      return NextResponse.json({ msg: 'Comment not found' }, { status: 404 });
    }

    if (comment.author.toString() !== user.id) {
      return NextResponse.json({ msg: 'User not authorized' }, { status: 401 });
    }

    const { content } = await req.json();
    comment.content = content;
    await comment.save();
    await comment.populate('author', 'displayName avatar');

    return NextResponse.json(comment);
  } catch (err) {
    console.error((err as Error).message);
    return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await dbConnect();

  try {
    const user = await verifyToken(req);
    if (!user) {
      return NextResponse.json({ msg: 'No token, authorization denied' }, { status: 401 });
    }
    const params = await context.params;
    const comment: IComment | null = await Comment.findById(params.id);

    if (!comment) {
      return NextResponse.json({ msg: 'Comment not found' }, { status: 404 });
    }

    if (comment.author.toString() !== user.id) {
      return NextResponse.json({ msg: 'User not authorized' }, { status: 401 });
    }

    const deleteChildren = async (parentId: string) => {
      const children: IComment[] = await Comment.find({ parent: parentId });
      for (const child of children) {
        await deleteChildren(child._id);
        await Comment.findByIdAndDelete(child._id);
      }
    };

    await deleteChildren(params.id);
    await Comment.findByIdAndDelete(params.id);

    return NextResponse.json({ msg: 'Comment removed' });
  } catch (err) {
    console.error((err as Error).message);
    return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
  }
}

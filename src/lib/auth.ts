
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import User, { IUser } from '@/lib/models/User';

export const verifyToken = async (req: NextRequest): Promise<IUser | null> => {
  const token = req.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await User.findById(decoded.id).select('-password');
    return user;
  } catch (error) {
    return null;
  }
};


import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: '30d',
  });
};

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ msg: 'Proszę podać email i hasło' }, { status: 400 });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return NextResponse.json({ msg: 'Użytkownik o tym emailu już istnieje' }, { status: 400 });
    }

    const user = await User.create({
      email,
      password,
    });

    if (user) {
      return NextResponse.json({
        _id: user._id,
        email: user.email,
        token: generateToken((user._id as string).toString()),
      }, { status: 201 });
    } else {
      return NextResponse.json({ msg: 'Nieprawidłowe dane użytkownika' }, { status: 400 });
    }
  } catch (err) {
    console.error('Błąd serwera przy rejestracji:', (err as Error).message);
    return NextResponse.json({ msg: 'Błąd serwera' }, { status: 500 });
  }
}

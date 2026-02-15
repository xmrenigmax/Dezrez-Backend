import { NextRequest, NextResponse } from 'next/server';
import * as AuthService from '@/services/authService';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import _ from 'lodash';

// Register Logic
export async function registerUser(req: NextRequest) {
  await dbConnect();
  try {
    const { email, password, role } = await req.json();
    const existingUser = await User.findOne({ email });
    
    if (existingUser) return NextResponse.json({ error: 'User exists' }, { status: 400 });

    const hashedPassword = await AuthService.hashPassword(password);
    const user = await User.create({ 
      email, 
      password: hashedPassword,
      role: role || 'user' // Default to user, Admin must be set manually or via specific check
    });

    return NextResponse.json({ message: 'User created' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Login Logic (Fixes your "missing loginUser" error)
export async function loginUser(req: NextRequest) {
  await dbConnect();
  try {
    const { email, password } = await req.json();
    const user = await User.findOne({ email }).select('+password +role');

    if (_.isNil(user) || !(await AuthService.verifyPassword(password, user.password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = AuthService.generateToken(user._id, user.role);

    return NextResponse.json({
      token: token,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role
      }
    }, { status: 200 });
  } catch(error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
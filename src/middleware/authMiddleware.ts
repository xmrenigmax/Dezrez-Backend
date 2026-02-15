import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

const JWT_SECRET = process.env.JWT_SECRET;

if (_.isNil(JWT_SECRET)) {
  throw new Error('FATAL: JWT_SECRET environment variable is missing.');
}

export async function verifyAdmin(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  if (_.isNil(authHeader) || !authHeader.startsWith('Bearer ')) {
    return false; // No token
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET as string);
    
    // Check if role is admin
    if (decoded.role !== 'admin') {
      return false;
    }

    return decoded; // Return user data if valid
  } catch (error) {
    return false; // Invalid token
  }
}
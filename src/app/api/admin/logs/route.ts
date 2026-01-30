import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/middleware/authMiddleware';
import CallLog from '@/models/CallLog';
import dbConnect from '@/lib/dbConnect';

export async function GET(req: NextRequest) {
  await dbConnect();
  
  // High-Security Check: Only Admins can see the logs
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized: Admins only' }, { status: 403 });
  }

  const logs = await CallLog.find({}).sort({ createdAt: -1 });
  return NextResponse.json(logs);
}
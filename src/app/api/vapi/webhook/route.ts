export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import _ from 'lodash';
import { searchDezrezListings } from '@/services/dezrez';
import CallLog from '@/models/CallLog';
import dbConnect from '@/lib/dbConnect';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    // 1. Validate Secret (Security)
    const secret = req.headers.get('x-vapi-secret');
    if (secret !== process.env.VAPI_WEBHOOK_SECRET) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const messageType = _.get(body, 'message.type');

    // 2. Route Vapi Events
    if (messageType === 'tool-calls') {
      return await handleToolCalls(body);
    } else if (messageType === 'end-of-call-report') {
      return await handleEndOfCall(body);
    }

    return NextResponse.json({ message: 'Handled' }, { status: 200 });

  } catch (error) {
    console.error('Vapi Webhook Error:', error);
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}

// --- Handler: Tool Calls (DezRez Integration) ---
async function handleToolCalls(payload: any) {
  const tools = _.get(payload, 'message.toolCalls', []);
  const results = [];

  for (const tool of tools) {
    if (tool.function.name === 'searchListings') {
      const args = JSON.parse(tool.function.arguments);
      
      // Call DezRez Service
      const listings = await searchDezrezListings(args);

      results.push({
        toolCallId: tool.id,
        result: JSON.stringify({
          message: `I found ${ listings.length } listings matching your criteria.`,
          data: listings
        })
      });
    }
  }

  return NextResponse.json({ results }, { status: 200 });
}

// --- Handler: End of Call (Audit Logging) ---
async function handleEndOfCall(payload: any) {
  const call = _.get(payload, 'message.call');
  
  await CallLog.create({
    vapiCallId: call.id,
    assistantId: call.assistantId,
    status: call.status,
    cost: call.cost,
    durationSeconds: _.get(payload, 'message.durationSeconds'),
    transcript: call.transcript,
    sentiment: _.get(payload, 'message.analysis.sentiment')
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
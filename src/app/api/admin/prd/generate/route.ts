import { NextResponse } from 'next/server';
import { generatePRDDocument } from '@/lib/prd-generator';
import type { GeneratePRDRequest, GeneratePRDResponse } from '@/types/prd';

export async function POST(request: Request) {
  try {
    const body: GeneratePRDRequest = await request.json();
    const prdContent = await generatePRDDocument(body);
    const response: GeneratePRDResponse = { prdContent };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating PRD document:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate PRD document' },
      { status: 500 }
    );
  }
}

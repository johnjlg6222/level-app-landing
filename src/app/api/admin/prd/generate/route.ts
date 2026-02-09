import { NextResponse } from 'next/server';
import { generatePRDDocument } from '@/lib/prd-generator';
import type { GeneratePRDRequest, GeneratePRDResponse } from '@/types/prd';

export async function POST(request: Request) {
  try {
    const body: GeneratePRDRequest = await request.json();

    // Pass selectedFeatures through for strict scoping
    const prdContent = await generatePRDDocument({
      quoteData: body.quoteData,
      answers: body.answers,
      questions: body.questions,
      selectedFeatures: body.selectedFeatures || body.quoteData.selectedFeatures,
    });

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

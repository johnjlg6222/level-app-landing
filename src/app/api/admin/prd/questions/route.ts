import { NextResponse } from 'next/server';
import { generatePRDQuestions } from '@/lib/prd-generator';
import type { GenerateQuestionsRequest, GenerateQuestionsResponse } from '@/types/prd';

export async function POST(request: Request) {
  try {
    const body: GenerateQuestionsRequest = await request.json();
    const questions = await generatePRDQuestions(body);
    const response: GenerateQuestionsResponse = { questions };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating PRD questions:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate PRD questions' },
      { status: 500 }
    );
  }
}

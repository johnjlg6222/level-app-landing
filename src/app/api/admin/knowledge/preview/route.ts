import { NextResponse } from 'next/server';
import { buildSystemPrompt } from '@/lib/knowledge-builder';

// GET compiled system prompt preview
export async function GET() {
  try {
    const systemPrompt = await buildSystemPrompt();

    return NextResponse.json({
      prompt: systemPrompt,
      length: systemPrompt.length,
      estimatedTokens: Math.ceil(systemPrompt.length / 4), // Rough estimate
    });
  } catch (error) {
    console.error('Error building system prompt:', error);
    return NextResponse.json(
      { error: 'Failed to build system prompt' },
      { status: 500 }
    );
  }
}

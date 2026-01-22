import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import type { KnowledgeVersion } from '@/types/knowledge';

// GET version history for a knowledge entry
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const knowledgeId = searchParams.get('knowledge_id');

    if (!knowledgeId) {
      return NextResponse.json(
        { error: 'knowledge_id is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('knowledge_versions')
      .select('*')
      .eq('knowledge_id', knowledgeId)
      .order('version_number', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: data as KnowledgeVersion[] });
  } catch (error) {
    console.error('Error fetching versions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch version history' },
      { status: 500 }
    );
  }
}

// POST create a new version (auto-called when saving)
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { knowledge_id, content, created_by } = body;

    if (!knowledge_id || !content) {
      return NextResponse.json(
        { error: 'knowledge_id and content are required' },
        { status: 400 }
      );
    }

    // Get the current highest version number
    const { data: latestVersion, error: fetchError } = await supabase
      .from('knowledge_versions')
      .select('version_number')
      .eq('knowledge_id', knowledge_id)
      .order('version_number', { ascending: false })
      .limit(1)
      .single();

    const nextVersionNumber = fetchError || !latestVersion
      ? 1
      : latestVersion.version_number + 1;

    // Create new version
    const { data, error } = await supabase
      .from('knowledge_versions')
      .insert({
        knowledge_id,
        content,
        version_number: nextVersionNumber,
        created_by: created_by || 'admin',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error creating version:', error);
    return NextResponse.json(
      { error: 'Failed to create version' },
      { status: 500 }
    );
  }
}

// PUT restore a version
export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { version_id, knowledge_id } = body;

    if (!version_id || !knowledge_id) {
      return NextResponse.json(
        { error: 'version_id and knowledge_id are required' },
        { status: 400 }
      );
    }

    // Get the version to restore
    const { data: version, error: versionError } = await supabase
      .from('knowledge_versions')
      .select('content')
      .eq('id', version_id)
      .single();

    if (versionError || !version) {
      return NextResponse.json(
        { error: 'Version not found' },
        { status: 404 }
      );
    }

    // Update the knowledge entry with the restored content
    const { data: updated, error: updateError } = await supabase
      .from('chatbot_knowledge')
      .update({ content: version.content })
      .eq('id', knowledge_id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    // Create a new version to record this restore action
    const { data: latestVersion } = await supabase
      .from('knowledge_versions')
      .select('version_number')
      .eq('knowledge_id', knowledge_id)
      .order('version_number', { ascending: false })
      .limit(1)
      .single();

    const nextVersionNumber = latestVersion ? latestVersion.version_number + 1 : 1;

    await supabase
      .from('knowledge_versions')
      .insert({
        knowledge_id,
        content: version.content,
        version_number: nextVersionNumber,
        created_by: 'admin (restored)',
      });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('Error restoring version:', error);
    return NextResponse.json(
      { error: 'Failed to restore version' },
      { status: 500 }
    );
  }
}

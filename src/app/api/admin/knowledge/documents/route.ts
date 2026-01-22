import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import type { KnowledgeDocument, KnowledgeSection, DocumentStatus } from '@/types/knowledge';

// GET all documents or filter by section
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
    const section = searchParams.get('section') as KnowledgeSection | null;
    const status = searchParams.get('status') as DocumentStatus | null;

    let query = supabase
      .from('knowledge_documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (section) {
      query = query.eq('section', section);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: data as KnowledgeDocument[] });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

// PUT update document (status, extracted_text)
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
    const { id, status, extracted_text } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    const updates: Partial<KnowledgeDocument> = {};

    if (status) {
      updates.status = status;
    }

    if (extracted_text !== undefined) {
      updates.extracted_text = extracted_text;
    }

    const { data, error } = await supabase
      .from('knowledge_documents')
      .update(updates)
      .eq('id', id)
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
    console.error('Error updating document:', error);
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    );
  }
}

// DELETE a document
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // First, get the document to find the storage path
    const { data: document, error: fetchError } = await supabase
      .from('knowledge_documents')
      .select('storage_path')
      .eq('id', id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Delete from storage if path exists
    if (document.storage_path) {
      const { error: storageError } = await supabase.storage
        .from('knowledge-documents')
        .remove([document.storage_path]);

      if (storageError) {
        console.warn('Failed to delete file from storage:', storageError);
      }
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('knowledge_documents')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}

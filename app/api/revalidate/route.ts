import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Revalidate all pages
    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/highlights');
    revalidatePath('/about');
    
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ revalidated: false, error: 'Failed to revalidate' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Use POST to revalidate' });
}

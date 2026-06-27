import { NextResponse } from 'next/server';
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const res = await fetch(`http://localhost:3001/search?q=${encodeURIComponent(q || '')}`);
  const data = await res.json();
  return NextResponse.json(data);
}

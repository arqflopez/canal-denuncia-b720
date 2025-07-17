import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const codigo = url.searchParams.get('codigo');

  if (!codigo) return NextResponse.json({ error: 'Código no proporcionado' }, { status: 400 });

  const { data, error } = await supabase
    .from('denuncia')
    .select('*')
    .eq('codigo', codigo)
    .single();

  if (error || !data) return NextResponse.json({ error: 'Código no encontrado' }, { status: 404 });

  return NextResponse.json(data);
}

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { codigo, cambios } = await req.json();

  if (!codigo || !cambios) {
    return NextResponse.json({ error: 'Código o cambios no proporcionados' }, { status: 400 });
  }

  const { data, error: getError } = await supabase
    .from('denuncia')
    .select('comentarios')
    .eq('codigo', codigo)
    .single();

  if (getError || !data) {
    return NextResponse.json({ error: 'Código inválido' }, { status: 404 });
  }

  const nuevosComentarios = [
    ...(data.comentarios || []),
    { texto: cambios.nuevoComentario, fecha: new Date().toISOString().split('T')[0] },
  ];

  const { error: updateError } = await supabase
    .from('denuncia')
    .update({ comentarios: nuevosComentarios })
    .eq('codigo', codigo);

  if (updateError) {
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

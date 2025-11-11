import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { codigo, cambios } = await req.json();

    if (!codigo || !cambios || !cambios.nuevoComentario) {
      return NextResponse.json({ error: 'Código o cambios no proporcionados' }, { status: 400 });
    }

    const denuncia = await prisma.denuncia.findUnique({ where: { codigo } });
    if (!denuncia) return NextResponse.json({ error: 'Código inválido' }, { status: 404 });

    const comentariosPrevios: { texto: string; fecha: string }[] =
      Array.isArray(denuncia.comentarios)
        ? (denuncia.comentarios as { texto: string; fecha: string }[])
        : [];

    const nuevosComentarios = [
      ...comentariosPrevios,
      { texto: cambios.nuevoComentario, fecha: new Date().toISOString().split('T')[0] },
    ];

    await prisma.denuncia.update({
      where: { codigo },
      data: { comentarios: nuevosComentarios },
    });

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error en la API:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

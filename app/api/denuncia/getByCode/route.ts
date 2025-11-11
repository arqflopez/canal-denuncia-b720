import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const codigo = url.searchParams.get('codigo');

  if (!codigo) return NextResponse.json({ error: 'Código no proporcionado' }, { status: 400 });

  const denuncia = await prisma.denuncia.findUnique({ where: { codigo } });

  if (!denuncia) return NextResponse.json({ error: 'Código no encontrado' }, { status: 404 });

  return NextResponse.json(denuncia);
}

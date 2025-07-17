import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const codigo = url.searchParams.get('codigo');

  if (!codigo) return NextResponse.json({ error: 'Código no proporcionado' }, { status: 400 });

  const ruta = path.join(process.cwd(), 'data', 'denuncias.json');

  if (!fs.existsSync(ruta)) return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });

  const datos = JSON.parse(fs.readFileSync(ruta, 'utf8'));
  const caso = datos[codigo];

  if (!caso) return NextResponse.json({ error: 'Código no encontrado' }, { status: 404 });

  return NextResponse.json(caso);
}

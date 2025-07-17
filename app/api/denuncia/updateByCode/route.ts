import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { codigo, cambios } = body;

  if (!codigo || !cambios) {
    return NextResponse.json({ error: 'Código o cambios no proporcionados' }, { status: 400 });
  }

  const ruta = path.join(process.cwd(), 'data', 'denuncias.json');
  if (!fs.existsSync(ruta)) {
    return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
  }

  const datos = JSON.parse(fs.readFileSync(ruta, 'utf8'));
  if (!datos[codigo]) {
    return NextResponse.json({ error: 'Código inválido' }, { status: 404 });
  }

  const caso = datos[codigo];

  // Si es un nuevo comentario
  if (cambios.nuevoComentario) {
    const nuevoComentario = {
      texto: cambios.nuevoComentario,
      fecha: new Date().toISOString().split('T')[0],
    };

    // Aseguramos que existe el array
    caso.comentarios = [...(caso.comentarios || []), nuevoComentario];
  }

  // Si hay otros cambios, los aplicamos
  const restoCambios = { ...cambios };
  delete restoCambios.nuevoComentario;
  datos[codigo] = { ...caso, ...restoCambios };

  fs.writeFileSync(ruta, JSON.stringify(datos, null, 2));

  return NextResponse.json({ ok: true });
}

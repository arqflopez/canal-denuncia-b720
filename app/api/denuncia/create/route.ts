import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const denuncia = JSON.parse(body);
  const codigo = uuidv4().slice(0, 8);
  const ruta = path.join(process.cwd(), 'data', 'denuncias.json');

  const datos = fs.existsSync(ruta)
    ? JSON.parse(fs.readFileSync(ruta, 'utf8'))
    : {};

  const denunciaConCodigo = { ...denuncia, estado: 'Recibido', codigo };
  datos[codigo] = denunciaConCodigo;

  fs.mkdirSync(path.dirname(ruta), { recursive: true });
  fs.writeFileSync(ruta, JSON.stringify(datos, null, 2));

  try {
    await resend.emails.send({
      from: 'no-reply@b720.info',
      to: 'mauroserralvo@b720.com',
      subject: `⚠️ IMPORTANTE - Nueva denuncia recibida (Código: ${codigo})`,
      text: generarTextoDenuncia(denunciaConCodigo),
    });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }

  return NextResponse.json({ codigo });
}

function generarTextoDenuncia(data: any): string {
  return `
DENUNCIA RECIBIDA

Código de seguimiento: ${data.codigo}
Fecha aproximada del hecho: ${data.fecha}

Hecho denunciado:
${data.hecho}

Personas de b720 involucradas: ${data.personasGavina}
Otras personas involucradas: ${data.otrasPersonas}

Información de contacto proporcionada (opcional):

Nombre: ${data.nombre}
Apellidos: ${data.apellidos}
DNI: ${data.dni}
Organización: ${data.organizacion}
Correo: ${data.email}
Teléfono: ${data.telefono}
Relación con b720: ${data.relacion}
  `;
}

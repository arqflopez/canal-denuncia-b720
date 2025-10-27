import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

// Tipo explícito de la denuncia
type Denuncia = {
  fecha: string;
  hecho: string;
  personasGavina: string;
  otrasPersonas: string;
  nombre?: string;
  apellidos?: string;
  dni?: string;
  organizacion?: string;
  email?: string;
  telefono?: string;
  relacion?: string;
  codigo?: string;
  estado?: string;
  comentarios?: { texto: string; fecha: string }[];
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const data: Denuncia = JSON.parse(body);
    const codigo = uuidv4().slice(0, 8);

    const denuncia: Denuncia = {
      ...data,
      codigo,
      estado: 'Recibido',
      comentarios: [],
    };

    const { error } = await supabase.from('denuncia').insert(denuncia);

    if (error) throw new Error(error.message);

    await resend.emails.send({
      from: 'no-reply@b720.info',
      to: 'informatica@b720.com',
      subject: `⚠️ IMPORTANTE - Nueva denuncia recibida (Código: ${codigo})`,
      text: generarTextoDenuncia(denuncia),
    });

    return NextResponse.json({ codigo });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error en la API:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function generarTextoDenuncia(data: Denuncia): string {
  return `
DENUNCIA RECIBIDA

Código de seguimiento: ${data.codigo}
Fecha aproximada del hecho: ${data.fecha}

Hecho denunciado:
${data.hecho}

Personas de b720 involucradas: ${data.personasGavina}
Otras personas involucradas: ${data.otrasPersonas}

Información de contacto proporcionada (opcional):

Nombre: ${data.nombre || ''}
Apellidos: ${data.apellidos || ''}
DNI: ${data.dni || ''}
Organización: ${data.organizacion || ''}
Correo: ${data.email || ''}
Teléfono: ${data.telefono || ''}
Relación con b720: ${data.relacion || ''}
`;
}

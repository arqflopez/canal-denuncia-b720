"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Tipos definidos para evitar el uso de `any`
type Comentario = {
  texto: string;
  fecha: string;
};

type Caso = {
  estado: string;
  hecho: string;
  fecha: string;
  comentarios: Comentario[];
};

export default function SeguimientoPage() {
  const { codigo } = useParams();
  const [caso, setCaso] = useState<Caso | null>(null);
  const [comentario, setComentario] = useState('');
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    if (!codigo) return;

    const fetchCaso = async () => {
      const res = await fetch(`/api/denuncia/getByCode?codigo=${codigo}`);
      const data = await res.json();
      setCaso(data);
    };

    fetchCaso();
  }, [codigo]);

  const handleGuardarComentario = async () => {
    await fetch('/api/denuncia/updateByCode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        codigo,
        cambios: { nuevoComentario: comentario },
      }),
    });

    setComentario('');
    setEditando(false);

    // Recargar datos del caso actualizado
    if (codigo) {
      const res = await fetch(`/api/denuncia/getByCode?codigo=${codigo}`);
      const data = await res.json();
      setCaso(data);
    }
  };

  if (!caso) return <p className="p-4 text-neutral-900">Cargando...</p>;

  const comentarios = caso.comentarios || [];
  const mostrarFormulario = editando;
  const ultimaTarjeta = comentarios.length === 0;

  return (
    <div className='py-20 px-6'>
      <div className="border-b border-black/20 flex items-center justify-between max-w-xl mx-auto">
        <Image
          src="/b720-logo-white.svg"
          alt="Logo"
          width={190}
          height={40}
          className="filter invert-[0.8] pb-8 pt-8"
        />
        <Link href="/">
          <p className="text-neutral-900 px-2"> &#8249; Volver Atrás</p>
        </Link>
      </div>

      {/* Tarjeta original */}
      <div className="mt-6 p-4 bg-gray-50 border rounded-xl max-w-xl mx-auto border-black/20">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Seguimiento de denuncia</h1>
        <p className="text-sm text-gray-600 mb-6">Código de seguimiento: <b>{codigo}</b></p>
        <div className="space-y-2 text-neutral-900">
          <p className='text-green-500'><b className='text-neutral-900'>Estado:</b> {caso.estado}</p>
          <p><b>Hecho:</b> {caso.hecho}</p>
          <p><b>Fecha:</b> {caso.fecha}</p>
        </div>
      </div>

      {/* Tarjetas de comentarios */}
      {comentarios.map((coment: Comentario, idx: number) => {
        const esUltima = idx === comentarios.length - 1;
        const comentariosPrevios = comentarios.slice(0, idx + 1); // todos hasta este

        return (
          <div key={idx} className="max-w-xl mx-auto mt-6 bg-blue-100 border border-blue-300 rounded-xl p-4 relative">
            <span className="absolute top-2 right-3 bg-blue-600 text-white text-sm px-2 py-1 rounded-full">
              Editado
            </span>

            <div className="space-y-1 text-neutral-900 mb-4">
              <p className="text-green-600"><b>Estado:</b> {caso.estado}</p>
              <p><b>Hecho:</b> {caso.hecho}</p>
              <p><b>Fecha:</b> {caso.fecha}</p>
            </div>

            <div className="bg-white rounded p-3 border border-gray-300 space-y-2">
              {comentariosPrevios.map((c: Comentario, i: number) => (
                <div key={i} className="text-sm text-gray-800">
                  <p className="text-gray-500 mb-1"><b>Comentario {i + 1}</b> - {c.fecha}</p>
                  <p className="whitespace-pre-wrap">{c.texto}</p>
                  {i !== comentariosPrevios.length - 1 && <hr className="my-2 border-gray-200" />}
                </div>
              ))}
            </div>

            {esUltima && !editando && (
              <button
                onClick={() => setEditando(true)}
                className="mt-4 bg-neutral-900 hover:bg-neutral-700 text-white py-2 px-5 rounded-xl transition cursor-pointer"
              >
                + Añadir comentario
              </button>
            )}
          </div>
        );
      })}

      {/* Formulario para nuevo comentario */}
      {mostrarFormulario && (
        <div className="max-w-xl mx-auto mt-4 bg-white border p-4 rounded-xl border-neutral-300 text-neutral-900">
          <textarea
            value={comentario}
            onChange={e => setComentario(e.target.value)}
            className="w-full border p-3 rounded text-neutral-900 border-black/20"
            placeholder="Escribe tu comentario..."
          />
          <div className="flex justify-end space-x-2 mt-3">
            <button
              className="px-6 py-2 bg-neutral-200 text-black rounded-lg hover:bg-neutral-400 cursor-pointer transition"
              onClick={() => setEditando(false)}
            >
              Cancelar
            </button>
            <button
              className="px-6 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-700 cursor-pointer transition"
              onClick={handleGuardarComentario}
              disabled={!comentario.trim()}
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      {/* Botón debajo si no hay comentarios aún */}
      {ultimaTarjeta && !editando && (
        <div className="max-w-xl mx-auto mt-6 text-right">
          <button
            onClick={() => setEditando(true)}
            className="bg-neutral-900 hover:bg-neutral-700 text-white py-2 px-5 rounded-xl transition cursor-pointer"
          >
            + Añadir comentario
          </button>
        </div>
      )}
    </div>
  );
}

"use client"

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function DenunciaPage() {
  const [formData, setFormData] = useState({
    hecho: '',
    fecha: '',
    personas: '',
    otrasPersonas: '',
    nombre: '',
    apellidos: '',
    dni: '',
    organizacion: '',
    email: '',
    telefono: '',
    relacion: '',
  });

  const [codigo, setCodigo] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const enviarFormulario = async () => {
    const res = await fetch('/api/denuncia/create', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    setCodigo(data.codigo);
  };

  return (
    <div className="max-w-xl w-full mx-auto px-4 bg-white my-20 select-none">
      <div className="border-b border-black/20 flex items-center justify-between">
            <Image
                src="/b720-logo-white.svg"
                alt="Logo"
                width={190}
                height={40}
                className="filter invert-[0.8] pb-8 pt-8"
            />
         <Link href="/">
            <p className="text-neutral-900 px-2"> &#8249; Volver Atras</p>
        </Link>
      </div>

      <h1 className="text-2xl font-bold  text-gray-800 pt-12">Formulario de denuncia anónima</h1>
      <p className="text-sm mb-12 text-gray-500 pt-3">Este formulario es completamente anónimo, no recopilamos datos aparte de los que facilitas.</p>

      <div className="space-y-5">
        <textarea
          name="hecho"
          placeholder="Hecho denunciado *"
          className="w-full p-3 border rounded-xl bg-gray-50 placeholder:text-neutral-400 text-black"
          onChange={handleChange}
        />
        <input
          name="fecha"
          type="date"
          className="w-full p-3 border rounded-xl bg-gray-50 placeholder:text-neutral-400 text-black"
          onChange={handleChange}
        />
        <input
          name="personas"
          placeholder="Personas de b720 involucradas"
          className="w-full p-3 border rounded-xl bg-gray-50 placeholder:text-neutral-400 text-black"
          onChange={handleChange}
        />
        <input
          name="otrasPersonas"
          placeholder="Otras personas involucradas"
          className="w-full p-3 border rounded-xl bg-gray-50 placeholder:text-neutral-400 text-black"
          onChange={handleChange}
        />

        <p className="text-sm text-gray-600">
          Adjuntar documentación enviando un correo a:{" "}
          <b>backup@b720.com</b>
        </p>
        <p className="text-sm text-red-500">
          *Deja tus datos <span className="font-bold">SOLO</span> si quieres ser contactado. Es completamente opcional. De lo contrario te facilitaremos un número de seguimiento anónimo para que puedas ver el estado de tu denuncia.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="nombre" placeholder="Nombre" className="p-3 border rounded-xl bg-gray-50 placeholder:text-neutral-400 text-black" onChange={handleChange} />
          <input name="apellidos" placeholder="Apellidos" className="p-3 border rounded-xl bg-gray-50 placeholder:text-neutral-400 text-black" onChange={handleChange} />
          <input name="dni" placeholder="DNI" className="p-3 border rounded-xl bg-gray-50 placeholder:text-neutral-400 text-black" onChange={handleChange} />
          <input name="organizacion" placeholder="Organización" className="p-3 border rounded-xl bg-gray-50 placeholder:text-neutral-400 text-black" onChange={handleChange} />
          <input name="email" placeholder="Correo electrónico" className="p-3 border rounded-xl bg-gray-50 placeholder:text-neutral-400 text-black" onChange={handleChange} />
          <input name="telefono" placeholder="Teléfono de contacto" className="p-3 border rounded-xl bg-gray-50 placeholder:text-neutral-400 text-black" onChange={handleChange} />
        </div>

        <select name="relacion" className="w-full p-3 border rounded-xl bg-gray-50 placeholder:text-neutral-400 text-black" onChange={handleChange}>
          <option className="placeholder:text-neutral-400 text-black" value="">Relación con B720</option>
          <option className="placeholder:text-neutral-400 text-black">Empleado</option>
          <option className="placeholder:text-neutral-400 text-black">Empleado en practicas</option>
          <option className="placeholder:text-neutral-400 text-black">Empresa o entidad colaboradora</option>
          <option className="placeholder:text-neutral-400 text-black">Otra empresa o institución</option>
          <option className="placeholder:text-neutral-400 text-black">ex-empleado, voluntario, ex-voluntario</option>
          <option className="placeholder:text-neutral-400 text-black">Otros</option>
        </select>

        <button
          className="bg-gray-900 hover:bg-gray-700 text-white py-2 px-6 rounded-xl transition cursor-pointer"
          onClick={enviarFormulario}
        >
          Enviar denuncia
        </button>

        {codigo && (
          <p className="mt-4 text-green-600 bg-green-50 border border-green-200 rounded-xl p-4">
            Tu código de seguimiento es: <b className="select-text">{codigo}</b><br />
            Guárdalo para revisar o completar tu denuncia más adelante.
          </p>
        )}
        <p className="text-xs text-gray-500 mt-4">
          Los datos proporcionados serán utilizados exclusivamente para la gestión y resolución del caso. Al enviar esta denuncia, aceptas que la información sea tratada de forma confidencial por el departamento de Recursos Humanos, conforme a las políticas internas de privacidad y protección de datos.
        </p>

      </div>
    </div>
  );
}

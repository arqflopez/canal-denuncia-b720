'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function HomePage() {
  const [busqueda, setBusqueda] = useState('')
  const router = useRouter()

  const buscarCaso = async () => {
    if (!busqueda) return
    try {
      if (!busqueda.trim()) return;
      router.push(`/seguimiento/${busqueda.trim()}`);
    } catch (error) {
    }
  }

  return (
    <main className="min-h-screen bg-white px-6 py-20 flex flex-col items-center justify-start space-y-12">
      <div className="max-w-xl w-full">
        <div className="border-b border-black/20">
          <Image
              src="/b720-logo-white.svg"
              alt="Logo"
              width={190}
              height={40}
              className="filter invert-[0.8] pb-8 pt-8"
          />
        </div>
        <h1 className="text-2xl font-bold  text-gray-800 pt-12">Canal de Denuncias</h1>
        <p className="text-sm mb-12 text-gray-500 pt-3">
          Este espacio está destinado a reportar cualquier hecho que consideres relevante, de forma completamente anónima o, si lo deseas, proporcionando tus datos voluntariamente. Toda la información será gestionada con confidencialidad y recibida directamente por el departamento de Recursos Humanos.
        </p>

        <button
          onClick={() => router.push('/form')}
          className="w-full text-center bg-neutral-900 text-white py-3 rounded-xl hover:bg-neutral-700 transition cursor-pointer mb-12"
        >
          Hacer una denuncia
        </button>
        

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">¿Ya tienes un caso? Búscalo</h2>
          <p className="text-sm mb-12 text-gray-500">
            Al completar una denuncia, se te habrá proporcionado un código de seguimiento. Introduce ese código en el campo a continuación para consultar el estado de tu caso en cualquier momento. El acceso es privado y solo posible mediante dicho código.
          </p>
          <div className='flex items-center justify-center space-x-2'>
            <input
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Introduce el código de seguimiento"
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 placeholder:text-neutral-400 text-black"
            />
            <button
              className="bg-neutral-900 hover:bg-neutral-700 text-white py-3 px-6 rounded-xl transition cursor-pointer"
              onClick={buscarCaso}
            >
              Buscar
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

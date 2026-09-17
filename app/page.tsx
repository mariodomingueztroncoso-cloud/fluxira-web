'use client';

import Image from 'next/image';
import { useState, useRef } from 'react';

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [rgpd, setRgpd] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = (selectedFiles: FileList | File[]) => {
    const incoming = Array.from(selectedFiles);
    const invalid = incoming.find((f) => f.type !== 'application/pdf');
    if (invalid) {
      setStatus('error');
      setMessage('Por favor, selecciona solo archivos en formato PDF.');
      return;
    }
    setFiles((prev) => [...prev, ...incoming]);
    setStatus('idle');
    setMessage('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    // Permite volver a seleccionar el mismo archivo si se quitó y se añade de nuevo
    e.target.value = '';
  };

  const handleBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const canSubmit = nombre.trim() !== '' && telefono.trim() !== '' && files.length > 0 && rgpd;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus('loading');
    setMessage('Analizando tu factura, esto puede tardar hasta un minuto...');

    try {
      const formData = new FormData();
      files.forEach((f) => formData.append('files', f));
      formData.append('nombre', nombre.trim());
      formData.append('contacto', telefono.trim());
      if (email.trim()) formData.append('email', email.trim());

      const response = await fetch('/api/analizar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al procesar el archivo');
      }

      // La respuesta es el PDF del informe: descargarlo
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'informe_fluxira.pdf';
      document.body.appendChild(a);

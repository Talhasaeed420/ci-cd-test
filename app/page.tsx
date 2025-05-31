'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setMessage('Please select a file');

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      setMessage('File uploaded successfully!');
    } else {
      setMessage(data.error || 'Upload failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-white mb-8">Upload File to S3</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mb-4"
        />
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Upload
        </button>
      </form>
      {message && <p className="mt-4 text-white">{message}</p>}
    </div>
  );
}

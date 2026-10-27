import { useState, useRef } from 'react'
import './App.css'

function App() {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleSubmit = () => {
    if (files.length === 0) {
      alert('Please select at least one file')
      return
    }
    alert(`${files.length} file(s) selected`)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <section style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
      <h1>File Upload</h1>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        style={{
          border: isDragging ? '2px dashed #4f46e5' : '2px dashed #9ca3af',
          borderRadius: '8px',
          padding: '2rem',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragging ? '#f9fafb' : 'transparent',
        }}
      >
        <p>Drag and drop files here</p>
        <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>or click to browse</p>
        {files.length > 0 && (
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            {files.length} file(s) selected
          </p>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button type="button" onClick={handleSubmit}>
        Submit
      </button>
    </section>
  )
}

export default App

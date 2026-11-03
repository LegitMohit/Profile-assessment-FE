import { useState, useRef } from 'react'
import './App.css'

function App() {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [university, setUniversity] = useState('De Montfort University')
  const [country, setCountry] = useState('United Kingdom')
  const [course, setCourse] = useState('MSc International Business Management')
  const [degreeLevel, setDegreeLevel] = useState('Masters')
  const [programType, setProgramType] = useState('Taught')
  const [intake, setIntake] = useState('')

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

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

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async () => {
    if (files.length === 0) {
      alert('Please select at least one file')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append('documents', file)
      })
      formData.append('university', university)
      formData.append('country', country)
      formData.append('course', course)
      formData.append('degree_level', degreeLevel)
      formData.append('program_type', programType)
      if (intake) {
        formData.append('intake', intake)
      }
      formData.append('format', 'text')

      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
      const response = await fetch(`${apiBase}/api/assess/report`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || `Request failed with status ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px' }}>
      <h1>Student Eligibility Assessment</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          University
          <input value={university} onChange={(e) => setUniversity(e.target.value)} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          Country
          <input value={country} onChange={(e) => setCountry(e.target.value)} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          Course
          <input value={course} onChange={(e) => setCourse(e.target.value)} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          Degree Level
          <input value={degreeLevel} onChange={(e) => setDegreeLevel(e.target.value)} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          Program Type
          <input value={programType} onChange={(e) => setProgramType(e.target.value)} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          Intake (optional)
          <input value={intake} onChange={(e) => setIntake(e.target.value)} />
        </label>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        style={{
          border: isDragging ? '2px dashed #4f46e5' : '2px dashed #9ca3af',
          borderRadius: '8px',
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragging ? '#f9fafb' : 'transparent',
        }}
      >
        <p>Drag and drop files here</p>
        <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>or click to browse</p>
        {files.length > 0 && (
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            {files.length} file(s) selected: {files.map((f) => f.name).join(', ')}
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

      <button type="button" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Assessing...' : 'Submit'}
      </button>

      {error && (
        <div style={{ color: 'red', whiteSpace: 'pre-wrap' }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2>Results</h2>
          {result.text_report && (
            <pre style={{ background: '#f5f5f5', padding: '1rem', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
              {result.text_report}
            </pre>
          )}
          {result.json && (
            <details>
              <summary>JSON</summary>
              <pre style={{ background: '#f5f5f5', padding: '1rem', overflowX: 'auto' }}>
                {JSON.stringify(result.json, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}
    </section>
  )
}

export default App

import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'

// Set worker for pdf.js (CDN for simplicity in free setup)
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

export async function extractTextFromFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase()

  if (ext === 'pdf') {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    let text = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      text += content.items.map((item: any) => item.str).join(' ') + '\n'
    }
    return text.trim()
  }

  if (ext === 'docx') {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    return result.value.trim()
  }

  throw new Error('Unsupported file type. Please upload PDF or DOCX.')
}

// Very basic section splitter for imported text (can be improved)
export function parseResumeText(text: string) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  return {
    raw: text,
    summary: lines.slice(0, 5).join(' '),
    skills: lines.filter(l => /skills|technical|tools/i.test(l)).join(', '),
  }
}

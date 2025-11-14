require('dotenv').config()
const express = require('express')
const crypto = require('crypto')
const { GoogleGenAI } = require('@google/genai')

const PORT = process.env.PORT || 4000
const MODEL_ID = process.env.NANO_MODEL_ID ?? 'gemini-2.5-flash-image'
const DATA_URL_REGEX = /^data:[^;]+;base64,/i

const app = express()
app.use(express.json({ limit: '10mb' }))

const threadStore = new Map()
let nanoClient

const ensureClient = () => {
  if (!process.env.NANO_API_KEY) {
    throw new Error('NANO_API_KEY is missing. Add it to your environment before generating.')
  }
  if (!nanoClient) {
    nanoClient = new GoogleGenAI({ apiKey: process.env.NANO_API_KEY })
  }
  return nanoClient
}

const extractInlinePart = (response) => {
  if (!response) return null
  if (response.parts?.length) {
    return response.parts.find((part) => part.inlineData) ?? null
  }

  const candidateParts =
    response.candidates?.flatMap((candidate) => candidate?.content?.parts ?? []) ?? []
  return candidateParts.find((part) => part.inlineData) ?? null
}

const requestNanoBananaImage = async ({ prompt, baseImageBase64, mimeType }) => {
  const client = ensureClient()

  const contents = baseImageBase64
    ? [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType ?? 'image/png',
                data: baseImageBase64.replace(DATA_URL_REGEX, '')
              }
            }
          ]
        }
      ]
    : [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ]

  const response = await client.models.generateContent({
    model: MODEL_ID,
    contents
  })

  const imagePart = extractInlinePart(response)
  if (!imagePart?.inlineData?.data) {
    const fallbackText =
      response?.parts?.find((part) => part.text)?.text ??
      response?.candidates?.[0]?.content?.parts?.find((part) => part.text)?.text
    throw new Error(fallbackText || 'Nano Banana API did not return image data.')
  }

  const data = imagePart.inlineData.data
  const returnedMime = imagePart.inlineData.mimeType || 'image/png'

  return {
    imageId: crypto.randomUUID(),
    imageData: `data:${returnedMime};base64,${data}`,
    rawBase64: data,
    mimeType: returnedMime,
    seed: response?.responseId ?? crypto.randomUUID().replace(/-/g, '').slice(0, 12)
  }
}

const validatePromptPayload = (req, res, next) => {
  const { prompt, threadId } = req.body ?? {}
  if (!prompt || !threadId) {
    return res.status(400).json({ error: 'Prompt and threadId are required.' })
  }
  if (typeof prompt !== 'string' || typeof threadId !== 'string') {
    return res.status(400).json({ error: 'Invalid payload.' })
  }
  req.prompt = prompt.trim()
  req.threadId = threadId
  next()
}

app.post('/api/generate', validatePromptPayload, async (req, res) => {
  try {
    const payload = await requestNanoBananaImage({ prompt: req.prompt })
    threadStore.set(req.threadId, {
      lastImageId: payload.imageId,
      lastSeed: payload.seed,
      lastImageBase64: payload.rawBase64,
      mimeType: payload.mimeType,
      iterations: 1
    })
    res.json({
      imageId: payload.imageId,
      imageData: payload.imageData,
      seed: payload.seed
    })
  } catch (error) {
    console.error('generate error', error)
    res.status(500).json({ error: error.message || 'Unable to generate image.' })
  }
})

app.post('/api/refine', validatePromptPayload, async (req, res) => {
  const thread = threadStore.get(req.threadId)
  if (!thread) {
    return res.status(400).json({ error: 'Start a thread with Generate before refining.' })
  }
  if (!thread.lastImageBase64) {
    return res.status(400).json({ error: 'Previous image data missing for this thread. Clear and retry.' })
  }

  try {
    const nextIteration = (thread.iterations ?? 1) + 1
    const payload = await requestNanoBananaImage({
      prompt: req.prompt,
      baseImageBase64: thread.lastImageBase64,
      mimeType: thread.mimeType
    })
    threadStore.set(req.threadId, {
      lastImageId: payload.imageId,
      lastSeed: payload.seed,
      lastImageBase64: payload.rawBase64,
      mimeType: payload.mimeType,
      iterations: nextIteration
    })
    res.json({
      imageId: payload.imageId,
      imageData: payload.imageData,
      seed: payload.seed
    })
  } catch (error) {
    console.error('refine error', error)
    res.status(500).json({ error: error.message || 'Unable to refine image.' })
  }
})

app.post('/api/clear', (req, res) => {
  const { threadId } = req.body ?? {}
  if (threadId && threadStore.has(threadId)) {
    threadStore.delete(threadId)
  }
  res.json({ ok: true })
})

app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Mockup server ready' })
})

app.get('/', (_req, res) => {
  res.send('AI Visual Generator server')
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})

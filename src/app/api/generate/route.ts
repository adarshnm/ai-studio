import { NextResponse } from 'next/server'

function wait(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const id = setTimeout(() => resolve(), ms)
    if (signal) {
      signal.addEventListener(
        'abort',
        () => {
          clearTimeout(id)
          reject(new DOMException('Aborted', 'AbortError'))
        },
        { once: true },
      )
    }
  })
}

export async function POST(req: Request) {
  try {
    const { imageDataUrl, prompt, style } = await req.json()
    // Simulate 1–2s latency
    const delay = 1000 + Math.floor(Math.random() * 1000)
    await wait(delay, req.signal)

    // 20% chance of simulated error
    if (Math.random() < 0.2) {
      return NextResponse.json({ message: 'Model overloaded' }, { status: 503 })
    }

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const createdAt = new Date().toISOString()

    return NextResponse.json({
      id,
      imageUrl: imageDataUrl as string,
      prompt: String(prompt ?? ''),
      style: String(style ?? ''),
      createdAt,
    })
  } catch (err: unknown) {
    const aborted =
      typeof err === 'object' &&
      err !== null &&
      'name' in err &&
      (err as { name?: string }).name === 'AbortError'
    if (aborted) {
      return new NextResponse(null, {
        status: 499,
        statusText: 'Client Closed Request',
      })
    }
    return NextResponse.json({ message: 'Unexpected error' }, { status: 500 })
  }
}

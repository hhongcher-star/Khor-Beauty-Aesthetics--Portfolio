const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://khor-beauty-aesthetics-portfolio-production.up.railway.app/api'

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  if (!endpoint.startsWith('/')) {
    throw new Error('Invalid API endpoint')
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
      cache: 'no-store',
      signal: controller.signal,
    })

    const contentType = res.headers.get('content-type')

    if (!contentType?.includes('application/json')) {
      throw new Error('Invalid server response')
    }

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'API request failed')
    }

    return data
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }

    throw new Error('Unexpected API error')
  } finally {
    clearTimeout(timeout)
  }
}
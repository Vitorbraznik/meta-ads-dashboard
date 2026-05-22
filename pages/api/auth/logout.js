import { serialize } from 'cookie'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const cookie = serialize('meta_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })

  res.setHeader('Set-Cookie', cookie)
  res.status(200).json({ success: true })
}

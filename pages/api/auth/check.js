import { parse } from 'cookie'

export default async function handler(req, res) {
  const cookies = parse(req.headers.cookie || '')
  const token = cookies.meta_token

  if (!token) {
    return res.status(200).json({ authenticated: false })
  }

  try {
    const meRes = await fetch(
      `https://graph.facebook.com/v19.0/me?fields=id,name&access_token=${token}`
    )
    const meData = await meRes.json()

    if (meData.error) {
      return res.status(200).json({ authenticated: false })
    }

    res.status(200).json({ authenticated: true, user: meData })
  } catch {
    res.status(200).json({ authenticated: false })
  }
}

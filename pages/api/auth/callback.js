import { serialize } from 'cookie'

export default async function handler(req, res) {
  const { code, error } = req.query

  if (error || !code) {
    return res.redirect('/?error=auth_failed')
  }

  const appId = process.env.META_APP_ID || process.env.NEXT_PUBLIC_APP_ID
  const appSecret = process.env.META_APP_SECRET
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI ||
    `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}/api/auth/callback`

  try {
    const tokenRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token` +
      `?client_id=${appId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&client_secret=${appSecret}` +
      `&code=${code}`
    )
    const tokenData = await tokenRes.json()

    if (tokenData.error || !tokenData.access_token) {
      console.error('Token error:', tokenData)
      return res.redirect('/?error=token_failed')
    }

    const longTokenRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token` +
      `?grant_type=fb_exchange_token` +
      `&client_id=${appId}` +
      `&client_secret=${appSecret}` +
      `&fb_exchange_token=${tokenData.access_token}`
    )
    const longTokenData = await longTokenRes.json()
    const finalToken = longTokenData.access_token || tokenData.access_token

    const cookie = serialize('meta_token', finalToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 60,
      path: '/',
    })

    res.setHeader('Set-Cookie', cookie)
    res.redirect('/')
  } catch (err) {
    console.error('Callback error:', err)
    res.redirect('/?error=server_error')
  }
}

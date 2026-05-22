export default function handler(req, res) {
  const appId = process.env.META_APP_ID || process.env.NEXT_PUBLIC_APP_ID
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI ||
    `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}/api/auth/callback`

  const scope = [
    'ads_read',
    'ads_management',
    'business_management',
    'read_insights',
  ].join(',')

  const authUrl =
    `https://www.facebook.com/v19.0/dialog/oauth` +
    `?client_id=${appId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&response_type=code`

  res.redirect(authUrl)
}

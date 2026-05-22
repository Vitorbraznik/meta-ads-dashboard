import { parse } from 'cookie'

export default async function handler(req, res) {
  const cookies = parse(req.headers.cookie || '')
  const token = cookies.meta_token

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  try {
    const adAccountsRes = await fetch(
      `https://graph.facebook.com/v19.0/me/adaccounts` +
      `?fields=id,name,account_status,currency` +
      `&access_token=${token}`
    )
    const adAccountsData = await adAccountsRes.json()

    if (adAccountsData.error) {
      return res.status(400).json({ error: adAccountsData.error.message })
    }

    const accounts = adAccountsData.data || []
    if (accounts.length === 0) {
      return res.status(200).json({ campaigns: [], accounts: [] })
    }

    const primaryAccount = accounts[0]
    const campaignsRes = await fetch(
      `https://graph.facebook.com/v19.0/${primaryAccount.id}/campaigns` +
      `?fields=id,name,status,objective,daily_budget,lifetime_budget,start_time,stop_time,insights{impressions,clicks,ctr,spend,cpc,reach}` +
      `&access_token=${token}`
    )
    const campaignsData = await campaignsRes.json()

    if (campaignsData.error) {
      return res.status(400).json({ error: campaignsData.error.message })
    }

    res.status(200).json({
      campaigns: campaignsData.data || [],
      accounts,
    })
  } catch (err) {
    console.error('Campaigns API error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

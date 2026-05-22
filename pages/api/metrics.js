import { parse } from 'cookie'

export default async function handler(req, res) {
  const cookies = parse(req.headers.cookie || '')
  const token = cookies.meta_token

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const { accountId, dateRange = 'last_30d' } = req.query

  try {
    const adAccountsRes = await fetch(
      `https://graph.facebook.com/v19.0/me/adaccounts?fields=id,name&access_token=${token}`
    )
    const adAccountsData = await adAccountsRes.json()

    if (adAccountsData.error) {
      return res.status(400).json({ error: adAccountsData.error.message })
    }

    const accounts = adAccountsData.data || []
    if (accounts.length === 0) {
      return res.status(200).json({ metrics: [], daily: [] })
    }

    const targetAccount = accountId
      ? accounts.find((a) => a.id === accountId) || accounts[0]
      : accounts[0]

    const insightsRes = await fetch(
      `https://graph.facebook.com/v19.0/${targetAccount.id}/insights` +
      `?fields=impressions,clicks,ctr,spend,cpc,reach,frequency` +
      `&date_preset=${dateRange}` +
      `&time_increment=1` +
      `&access_token=${token}`
    )
    const insightsData = await insightsRes.json()

    if (insightsData.error) {
      return res.status(400).json({ error: insightsData.error.message })
    }

    const daily = insightsData.data || []

    const totals = daily.reduce(
      (acc, day) => ({
        impressions: acc.impressions + parseInt(day.impressions || 0),
        clicks: acc.clicks + parseInt(day.clicks || 0),
        spend: acc.spend + parseFloat(day.spend || 0),
        reach: acc.reach + parseInt(day.reach || 0),
      }),
      { impressions: 0, clicks: 0, spend: 0, reach: 0 }
    )

    totals.ctr = totals.impressions > 0
      ? ((totals.clicks / totals.impressions) * 100).toFixed(2)
      : '0.00'
    totals.cpc = totals.clicks > 0
      ? (totals.spend / totals.clicks).toFixed(2)
      : '0.00'

    res.status(200).json({ totals, daily })
  } catch (err) {
    console.error('Metrics API error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

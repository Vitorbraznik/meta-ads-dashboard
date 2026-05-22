import { useState, useEffect, useCallback } from 'react'
import MetricsCards from './MetricsCards'
import PerformanceChart from './PerformanceChart'
import CampaignsList from './CampaignsList'

const DATE_RANGES = [
  { label: 'Hoje', value: 'today' },
  { label: 'Últimos 7 dias', value: 'last_7d' },
  { label: 'Últimos 30 dias', value: 'last_30d' },
  { label: 'Este mês', value: 'this_month' },
  { label: 'Mês passado', value: 'last_month' },
]

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState([])
  const [totals, setTotals] = useState(null)
  const [daily, setDaily] = useState([])
  const [dateRange, setDateRange] = useState('last_30d')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [campRes, metricsRes] = await Promise.all([
        fetch('/api/campaigns'),
        fetch(`/api/metrics?dateRange=${dateRange}`),
      ])

      if (!campRes.ok || !metricsRes.ok) {
        throw new Error('Falha ao buscar dados. Verifique as permissões do app.')
      }

      const campData = await campRes.json()
      const metricsData = await metricsRes.json()

      if (campData.error) throw new Error(campData.error)
      if (metricsData.error) throw new Error(metricsData.error)

      setCampaigns(campData.campaigns || [])
      setTotals(metricsData.totals || null)
      setDaily(metricsData.daily || [])
      setLastUpdated(new Date())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [dateRange])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Visão Geral</h2>
          {lastUpdated && (
            <p className="text-xs text-gray-400 mt-0.5">
              Atualizado às {lastUpdated.toLocaleTimeString('pt-BR')}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {DATE_RANGES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>

          <button
            onClick={fetchData}
            disabled={loading}
            className="text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            {loading ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">
          <strong>Erro:</strong> {error}
        </div>
      )}

      <MetricsCards totals={totals} loading={loading} />
      <PerformanceChart daily={daily} loading={loading} />
      <CampaignsList campaigns={campaigns} loading={loading} />
    </main>
  )
}

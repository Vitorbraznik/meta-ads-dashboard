function formatNumber(n) {
  if (!n && n !== 0) return '—'
  const num = parseFloat(n)
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K'
  return num.toLocaleString('pt-BR')
}

function formatCurrency(n) {
  if (!n && n !== 0) return '—'
  return parseFloat(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const cards = [
  { label: 'Impressões', key: 'impressions', format: formatNumber, color: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
  { label: 'Cliques', key: 'clicks', format: formatNumber, color: 'bg-green-50 border-green-200', text: 'text-green-700' },
  { label: 'CTR', key: 'ctr', format: (v) => v ? `${v}%` : '—', color: 'bg-purple-50 border-purple-200', text: 'text-purple-700' },
  { label: 'Gasto Total', key: 'spend', format: formatCurrency, color: 'bg-orange-50 border-orange-200', text: 'text-orange-700' },
  { label: 'CPC', key: 'cpc', format: formatCurrency, color: 'bg-red-50 border-red-200', text: 'text-red-700' },
  { label: 'Alcance', key: 'reach', format: formatNumber, color: 'bg-teal-50 border-teal-200', text: 'text-teal-700' },
]

export default function MetricsCards({ totals, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {cards.map((c) => (
          <div key={c.key} className="bg-white rounded-xl p-4 shadow-sm border animate-pulse">
            <div className="h-3 bg-gray-200 rounded mb-3 w-3/4" />
            <div className="h-7 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {cards.map((c) => (
        <div key={c.key} className={`rounded-xl p-4 shadow-sm border ${c.color}`}>
          <p className="text-xs text-gray-500 mb-1">{c.label}</p>
          <p className={`text-xl font-bold ${c.text}`}>
            {c.format(totals?.[c.key])}
          </p>
        </div>
      ))}
    </div>
  )
}

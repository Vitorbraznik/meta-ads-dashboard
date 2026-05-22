import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const [, month, day] = dateStr.split('-')
  return `${day}/${month}`
}

export default function PerformanceChart({ daily, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="h-5 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
        <div className="h-64 bg-gray-100 rounded animate-pulse" />
      </div>
    )
  }

  const data = (daily || []).map((d) => ({
    date: formatDate(d.date_start),
    Impressões: parseInt(d.impressions || 0),
    Cliques: parseInt(d.clicks || 0),
    Gasto: parseFloat(d.spend || 0),
  }))

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6 text-center text-gray-400">
        <p className="text-sm">Sem dados de performance para o período selecionado.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
      <h2 className="text-base font-semibold text-gray-700 mb-4">Performance Diária</h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Impressões" stroke="#3b82f6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Cliques" stroke="#10b981" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

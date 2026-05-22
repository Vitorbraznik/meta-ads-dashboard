const STATUS_LABELS = {
  ACTIVE: { label: 'Ativa', color: 'bg-green-100 text-green-700' },
  PAUSED: { label: 'Pausada', color: 'bg-yellow-100 text-yellow-700' },
  DELETED: { label: 'Deletada', color: 'bg-red-100 text-red-700' },
  ARCHIVED: { label: 'Arquivada', color: 'bg-gray-100 text-gray-600' },
}

function formatCurrency(n) {
  if (!n && n !== 0) return '—'
  return parseFloat(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function CampaignsList({ campaigns, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="h-5 bg-gray-200 rounded w-40 mb-4 animate-pulse" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded mb-2 animate-pulse" />
        ))}
      </div>
    )
  }

  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
        <p className="text-gray-400 text-sm">Nenhuma campanha encontrada.</p>
        <p className="text-gray-300 text-xs mt-1">Verifique as permissões do app Meta ou crie campanhas na sua conta.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-base font-semibold text-gray-700 mb-4">
        Campanhas ({campaigns.length})
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500 text-xs uppercase tracking-wide">
              <th className="pb-3 pr-4">Campanha</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3 pr-4">Impressões</th>
              <th className="pb-3 pr-4">Cliques</th>
              <th className="pb-3 pr-4">CTR</th>
              <th className="pb-3">Gasto</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => {
              const ins = campaign.insights?.data?.[0] || {}
              const statusInfo = STATUS_LABELS[campaign.status] || { label: campaign.status, color: 'bg-gray-100 text-gray-600' }
              return (
                <tr key={campaign.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 pr-4">
                    <p className="font-medium text-gray-800 truncate max-w-xs">{campaign.name}</p>
                    <p className="text-xs text-gray-400">{campaign.objective?.replace(/_/g, ' ')}</p>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-gray-700">
                    {parseInt(ins.impressions || 0).toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3 pr-4 text-gray-700">
                    {parseInt(ins.clicks || 0).toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3 pr-4 text-gray-700">
                    {ins.ctr ? `${parseFloat(ins.ctr).toFixed(2)}%` : '—'}
                  </td>
                  <td className="py-3 text-gray-700">
                    {formatCurrency(ins.spend)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

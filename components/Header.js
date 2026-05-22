export default function Header({ user, onLogout, isAuthenticated }) {
  return (
    <header className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-700 font-bold text-sm">M</span>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">Meta Ads Dashboard</h1>
              <p className="text-blue-200 text-xs">AF Motors</p>
            </div>
          </div>

          {isAuthenticated && user && (
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-blue-200">Conectado</p>
              </div>
              <button
                onClick={onLogout}
                className="bg-blue-600 hover:bg-blue-800 text-white text-sm px-3 py-1.5 rounded-md transition-colors"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

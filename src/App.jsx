import React from 'react';
import Ticker from './components/Ticker';
import MarketChart from './components/MarketChart';
import NewsMarquee from './components/NewsMarquee';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="p-4 text-2xl font-bold bg-gray-800 shadow-md">
        📈 Market Tracker
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 space-y-6">
        <section className="bg-gray-800 rounded-xl p-4 shadow-md">
          <h2 className="text-xl mb-2 font-semibold text-yellow-400">Live Ticker</h2>
          <Ticker />
        </section>

        <section className="bg-gray-800 rounded-xl p-4 shadow-md">
          <h2 className="text-xl mb-2 font-semibold text-blue-400">Market Chart</h2>
          <MarketChart />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-sm p-2 border-t border-gray-700">
        <NewsMarquee />
      </footer>
    </div>
  );
}

export default App;

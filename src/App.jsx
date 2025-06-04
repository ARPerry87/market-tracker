import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Ticker from './components/Ticker';
import MarketChart from './components/MarketChart';
import NewsMarquee from './components/NewsMarquee';
import LiveQuotes from './components/LiveQuotes';
import ManageSymbols from './components/ManageSymbols';

function App() {
  const [symbols, setSymbols] = useState(["AAPL", "TSLA", "GOOGL", "AMZN"]);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <header className="p-4 text-2xl font-bold bg-gray-800 shadow-md flex justify-between items-center">
          <span>📈 Market Tracker</span>
          <Link to="/manage" className="text-sm text-yellow-400 underline">Manage Ticker Symbols</Link>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 space-y-6">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <section className="bg-gray-800 rounded-xl p-4 shadow-md">
                    <h2 className="text-xl mb-2 font-semibold text-yellow-400">Live Ticker</h2>
                    <Ticker symbols={symbols} />
                  </section>

                  <section className="bg-gray-800 rounded-xl p-4 shadow-md">
                    <h2 className="text-xl mb-2 font-semibold text-blue-400">Market Chart</h2>
                    <MarketChart />
                  </section>

                  <section className="bg-gray-800 rounded-xl p-4 shadow-md">
                    <h2 className="text-xl mb-2 font-semibold text-green-400">Live Stock Data</h2>
                    <LiveQuotes />
                  </section>
                </>
              }
            />

            <Route
              path="/manage"
              element={<ManageSymbols symbols={symbols} setSymbols={setSymbols} />}
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-sm p-2 border-t border-gray-700">
          <NewsMarquee />
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;

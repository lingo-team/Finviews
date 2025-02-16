import { useState, useEffect, useRef } from 'react';
import { Search, Bell } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';

const TradingViewWidget = ({ symbol }: { symbol: string }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "${symbol}",
        "interval": "D",
        "timezone": "exchange",
        "theme": "light",
        "style": "1",
        "locale": "en",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "container_id": "tradingview_advanced_chart"
      }`;
    container.current.innerHTML = '';
    container.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="tradingview-widget-container h-full" ref={container}>
      <div id="tradingview_advanced_chart" className="tradingview-widget-container__widget h-full" />
    </div>
  );
};

interface MarketItem {
  title: string;
  symbol: string;
  price: string;
  change: number;
}

interface MarketData {
  [key: string]: MarketItem[];
}

function Markets() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Indices');
  const [selectedSymbol, setSelectedSymbol] = useState('SP:SPX');

  const mockData: MarketData = {
    Indices: [
      { title: 'S&P 500', symbol: 'SP:SPX', price: '4,563.45', change: 0.87 },
      { title: 'Dow Jones', symbol: 'DJ:DJI', price: '34,029.87', change: -0.34 },
    ],
    Stocks: [
      { title: 'Tesla', symbol: 'NASDAQ:TSLA', price: '245.67', change: 3.45 },
      { title: 'Apple', symbol: 'NASDAQ:AAPL', price: '171.29', change: 1.56 },
    ],
    Crypto: [
      { title: 'Bitcoin', symbol: 'COINBASE:BTCUSD', price: '43,567.89', change: 2.34 },
      { title: 'Ethereum', symbol: 'COINBASE:ETHUSD', price: '2,345.67', change: -1.23 },
    ],
    Forex: [
      { title: 'EUR/USD', symbol: 'FX:EURUSD', price: '1.1956', change: 0.12 },
      { title: 'USD/JPY', symbol: 'FX:USDJPY', price: '109.45', change: -0.23 },
    ]
  };

  const categoryData = mockData[activeTab] || [];
  const filteredData = categoryData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="md:ml-64 p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 space-x-4">
          <div className="relative w-full md:w-72 mr-4">
            <input
              type="text"
              placeholder="Search markets, symbols, or assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
        </div>


        {/* Tabs */}
        <div className="flex overflow-x-auto space-x-4 mb-8">
          {Object.keys(mockData).map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 font-medium whitespace-nowrap ${
                activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
              }`}
              onClick={() => {
                setActiveTab(tab);
                setSelectedSymbol(mockData[tab][0]?.symbol || '');
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Market Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredData.map((item, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow border hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedSymbol(item.symbol)}
            >
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.symbol}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-lg font-bold">${item.price}</span>
                <span className={`text-sm font-medium ${
                  item.change >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {item.change >= 0 ? '+' : ''}{item.change}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow-lg h-[calc(100vh-22rem)]">
          <TradingViewWidget symbol={selectedSymbol} />
        </div>
      </div>
    </div>
  );
}

export default Markets;
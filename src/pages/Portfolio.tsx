import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { Sidebar } from '../components/Sidebar';
import { Brain, Sparkles, ChartLine, Workflow } from 'lucide-react';
import 'react-day-picker/dist/style.css';

interface TradingStrategy {
  name: string;
  icon: JSX.Element;
  description: string;
}

function Portfolio() {
  const [selectedRange, setSelectedRange] = useState<any>();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const tradingStrategies: TradingStrategy[] = [
    {
      name: "Sentiment Analysis",
      icon: <Brain className="h-5 w-5" />,
      description: "Trade based on market sentiment and news analysis"
    },
    {
      name: "Reinforcement Learning",
      icon: <Sparkles className="h-5 w-5" />,
      description: "AI-powered trading decisions using RL algorithms"
    },
    {
      name: "Technical Analysis",
      icon: <ChartLine className="h-5 w-5" />,
      description: "Trade using technical indicators and patterns"
    },
    {
      name: "Mean Reversion",
      icon: <Workflow className="h-5 w-5" />,
      description: "Capitalize on price deviations from historical average"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Sidebar />
      
      <div className="md:ml-64 p-4 md:p-8">
        <h1 className="text-2xl text-center font-bold text-gray-900 mb-6">Your Portfolio</h1>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Select Date Range</h2>
            <div className="flex flex-col items-center">
              <DayPicker
                mode="range"
                selected={selectedRange}
                onSelect={setSelectedRange}
                className="border rounded-lg p-4"
              />
              <div className="mt-4 text-center">
                <p className="text-gray-600">
                  {selectedRange?.from ? (
                    <div className="flex flex-col md:flex-row md:space-x-4">
                      <span>Start: {format(selectedRange.from, 'PPP')}</span>
                      {selectedRange.to && (
                        <span>End: {format(selectedRange.to, 'PPP')}</span>
                      )}
                    </div>
                  ) : (
                    'Please select a date range'
                  )}
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-4 mt-6 w-full md:w-auto">
              <button
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={() => {
                        const url = "http://localhost:5999/sentiment_analysis";
                      
                        fetch(url, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json"
                          },
                          body: JSON.stringify(selectedRange)
                        })
                          .then(response => response.json())
                          .then(data => console.log(data))
                          .catch(error => console.error('Error:', error));
                      }}
                    >
                      Backtesting
                    </button>
                <button
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  onClick={() => console.log('Starting trade...', selectedRange)}
                >
                  Start Trading
                </button>
              </div>
            </div>
          </div>

          <div className={`${isMobile ? 'w-full' : 'lg:w-1/3'} bg-white rounded-lg shadow-md p-6`}>
            <h2 className="text-xl font-semibold mb-4">Trading Strategies</h2>
            <div className="space-y-4">
              {tradingStrategies.map((strategy, index) => (
                <button
                  key={index}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  onClick={() => console.log(`Selected ${strategy.name}`)}
                >
                  <div className="p-2 bg-gray-100 rounded-full">
                    {strategy.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">{strategy.name}</h3>
                    <p className="text-sm text-gray-600">{strategy.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Portfolio;
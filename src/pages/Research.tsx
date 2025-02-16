import { useState } from "react";
import { Card } from "@mui/material";
import { Brain, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { Sidebar } from "../components/Sidebar";

interface Feature {
  icon: JSX.Element;
  title: string;
  description: string;
}

interface ProgressUpdate {
  message: string;
  timestamp: number;
}

function Research() {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressUpdate[]>([]);
  const [showAlert, setShowAlert] = useState(false);

  const features: Feature[] = [
    {
      icon: <Brain className="h-6 w-6 text-blue-500" />,
      title: "Deep Analysis",
      description:
        "Our system performs comprehensive fundamental and technical analysis.",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-green-500" />,
      title: "Market Trends",
      description: "Get insights into market trends and potential opportunities.",
    },
    {
      icon: <AlertCircle className="h-6 w-6 text-orange-500" />,
      title: "Risk Assessment",
      description: "Understand potential risks and volatility factors.",
    },
  ];

  const handleStockAnalysis = async (symbol: string) => {
    if (!symbol.trim()) {
      setShowAlert(true);
      return;
    }
  
    setSelectedStock(symbol);
    setLoading(true);
    setError(null);
    setResult(null);
    setProgress([
      {
        message: "Initiating analysis...",
        timestamp: Date.now(),
      },
    ]);
  
    try {
      const response = await fetch("https://fincrew.onrender.com/analyze", { // Use Render endpoint here
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ company: symbol }),
      });
  
      const data = await response.text();
  
      setProgress((prev) => [
        ...prev,
        {
          message: "Analysis complete",
          timestamp: Date.now(),
        },
      ]);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="md:ml-64 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              System Two Thinking Researcher
            </h1>
            <p className="text-gray-600">
              Make informed investment decisions with our AI-powered stock
              analysis tool.
            </p>
          </div>

          {/* Analysis Form */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Stock Analysis
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const input = form.elements.namedItem(
                    "stock"
                  ) as HTMLInputElement;
                  handleStockAnalysis(input.value.toUpperCase());
                }}
              >
                <input
                  name="stock"
                  type="text"
                  placeholder="Enter stock symbol (e.g., AAPL, MSFT)..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`mt-4 w-full py-2 px-4 rounded-lg text-white
                    ${
                      loading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }`}
                >
                  {loading ? "Analyzing..." : "Analyze Stock"}
                </button>
              </form>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 bg-white rounded-lg shadow-sm flex flex-col items-center"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-gray-800 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm text-center mt-2">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>

          {/* Results Panel */}
          {selectedStock && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              {loading ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                    <p className="text-gray-600">Analyzing {selectedStock}...</p>
                  </div>
                  <div className="w-full space-y-2">
                    {progress.map((update, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 text-sm text-gray-600"
                      >
                        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                        <span>{update.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : result ? (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Investment Recommendation for {selectedStock}
                  </h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-600 whitespace-pre-wrap">{result}</p>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center text-red-500 p-4">
                  <AlertCircle className="h-6 w-6 mx-auto mb-2" />
                  {error}
                </div>
              ) : null}
            </div>
          )}

          {showAlert && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Input Required
                </h3>
                <p className="text-gray-600 mb-4">
                  Please enter a stock symbol before analyzing.
                </p>
                <button
                  onClick={() => setShowAlert(false)}
                  className="w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  OK
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Research;
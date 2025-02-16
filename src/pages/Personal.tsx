import { useState, FormEvent } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';

interface Message {
  type: 'user' | 'bot';
  content: string;
}

function Personal() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
  
    setIsLoading(true);
    setError(null);
    const userMessage = input;
    setInput('');
    setMessages((prev) => [...prev, { type: 'user', content: userMessage }]);
  
    try {
      const response = await fetch('https://personal-9d0j.onrender.com/get_answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage }),
      });
  
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setMessages((prev) => [...prev, { type: 'bot', content: data.answer }]);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to get response. Please try again.');
      setMessages((prev) => prev.filter((msg) => msg.content !== userMessage));
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="md:ml-64 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Card */}
          <div className="rounded-lg border bg-gradient-to-r from-blue-500 to-blue-600 text-white mb-6 p-6">
            <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Welcome to Your Financial Assistant</h2>
                <p className="text-blue-50">Ask me anything about personal finance, investments, or budgeting.</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border bg-red-50 border-red-200 mb-6 p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-4 mb-20">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`rounded-lg border bg-white shadow-sm p-4 ${
                  message.type === 'user' 
                    ? 'bg-blue-50 ml-0 md:ml-12' 
                    : 'bg-white mr-0 md:mr-12'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100'
                  }`}>
                    {message.type === 'user' ? 'U' : 'AI'}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="fixed bottom-4 left-0 right-0 md:left-64 px-4 md:px-8">
            <div className="rounded-lg border bg-white shadow-sm p-4">
              <div className="flex space-x-4">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask your financial question..."
                  className="flex-1 min-h-[44px] resize-none rounded-md border border-gray-200 
                  px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium 
                  transition-colors focus-visible:outline-none focus-visible:ring-2 
                  focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 
                  bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Personal;
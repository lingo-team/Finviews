import { useState, useEffect } from 'react';
import { Search, Bell, Filter } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { NewsCard } from '../components/NewsCard';
import { MarketOverview } from '../components/MarketOverview';
import { getFinanceNews, NewsArticle } from '../lib/services';
import { formatDistanceToNow } from 'date-fns';
import { UserAvatar } from '../components/Header';

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const articles = await getFinanceNews();
      setNewsData(articles);
    } catch (err) {
      setError('Failed to fetch news');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="md:ml-64 p-4 md:p-8">
        <div className="flex items-center justify-between flex-wrap sm:flex-nowrap w-full space-y-0">
          <div className="relative hidden sm:flex-grow sm:max-w-sm sm:block">
            <input
              type="text"
              placeholder="Search news, symbols, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>

          {/* Action Buttons (Aligned to the Right on Mobile) */}
          <div className="flex items-center space-x-4 ml-auto">
            <button className="p-2 hover:bg-gray-100 rounded-lg focus:outline-none">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <UserAvatar />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center lg:text-left">
            Market Overview
          </h2>
          <MarketOverview />
        </div>


        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Latest News</h2>
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Filter className="w-5 h-5" />
              <span className="hidden md:inline">Filter</span>
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsData.map((news, index) => (
                <NewsCard
                  key={index}
                  category={news.source.name}
                  title={news.title}
                  summary={news.description}
                  source={news.source.name}
                  time={formatDistanceToNow(new Date(news.publishedAt), { addSuffix: true })}
                  imageUrl={news.urlToImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000'}
                  url={news.url}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
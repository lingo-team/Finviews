import { useEffect, useState } from 'react';
import { Plus, Search, Menu, X } from 'lucide-react';
import { CategoryFilter } from '../components/CategoryFilter';
import { ThreadCard } from '../components/ThreadCard';
import { Sidebar } from '../components/Sidebar';
import { db, collection, getDocs, query, orderBy, addDoc } from '../lib/Firebase';
import Groq from "groq-sdk";

function Forums() {
  const [threads, setThreads] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState('');
  const [tags, setTags] = useState('');
  const [elaboratedContent, setElaboratedContent] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchThreads = async () => {
      const q = query(collection(db, 'threads'), orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      const threadsData: any[] = [];
      querySnapshot.forEach((doc) => {
        threadsData.push({ id: doc.id, ...doc.data() });
      });
      setThreads(threadsData);
    };

    fetchThreads();
  }, []);

  useEffect(() => {
    if (isPopupOpen && selectedThread) {
      const fetchElaboratedContent = async () => {
        const content = await elaborate(selectedThread.preview);
        setElaboratedContent(content);
      };
  
      fetchElaboratedContent();
    }
  }, [isPopupOpen, selectedThread]);

  const filteredThreads = threads.filter((thread) => {
    const matchesSearch = thread.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' ||
      thread.tags?.some((tag: string) =>
        tag.toLowerCase() === selectedCategory.toLowerCase()
      );
    return matchesSearch && matchesCategory;
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  async function elaborate(sentence: string) {
    const groq = new Groq({
      apiKey: "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",
      dangerouslyAllowBrowser: true 
    });
  
    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a financial expert blogger." },
        { role: "user", content: `Answer in a format of individual and individual paras and do not include an * or make the texts bold
          Provide a very detailed explanation about this, frame the sentences as you are creating a news article ${sentence}` },
      ],
      model: "llama3-8b-8192",
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1,
      stop: null,
      stream: false,
    });
  
    return response.choices[0]?.message?.content || "No explanation available.";
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setTitle('');
    setPreview('');
    setTags('');
  };

  const openPopup = (thread: any) => {
    setSelectedThread(thread);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setSelectedThread(null);
    setIsPopupOpen(false);
  };

  const handleSubmit = async () => {
    const staticAuthor = 'Admin';
    const staticAvatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100";
    const staticReplies = 0;
    const staticLikes = 0;
    const staticViews = 0;

    try {
      await addDoc(collection(db, 'threads'), {
        title,
        preview,
        tags: tags.split(',').map((tag) => tag.trim()),
        author: staticAuthor,
        avatar: staticAvatar,
        replies: staticReplies,
        likes: staticLikes,
        views: staticViews,
        created_at: new Date().toISOString(),
      });
      closeModal();
    } catch (error) {
      console.error('Error adding thread:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md lg:hidden"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 w-64`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-center items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Fintech Forums</h1>
            <button
              onClick={openModal}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full lg:w-auto justify-center"
            >
              <Plus className="w-5 h-5" />
              <span>New Thread</span>
            </button>
          </div>


          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search discussions by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          </div>

          <div className="overflow-x-auto -mx-4 px-4">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          <div className="space-y-4 mt-6">
            {filteredThreads.length > 0 ? (
              filteredThreads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => openPopup(thread)}
                  className="cursor-pointer"
                >
                  <ThreadCard {...thread} />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No threads found matching the criteria.</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create New Thread</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
              <textarea
                placeholder="Preview"
                value={preview}
                onChange={(e) => setPreview(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg min-h-[100px]"
              />
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Thread Popup */}
      {isPopupOpen && selectedThread && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-lg w-full max-w-4xl h-[90vh] overflow-y-auto">
            <div className="space-y-4">
              <h2 className="text-xl lg:text-2xl font-bold">{selectedThread.title}</h2>
              <h4 className="text-gray-600">{selectedThread.preview}</h4>
              <div className="prose max-w-none">
                {elaboratedContent || (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={closePopup}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for sidebar on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}

export default Forums;
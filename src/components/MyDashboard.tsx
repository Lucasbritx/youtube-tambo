import React from 'react';
import { Tab } from './Tab';
import { TrendingTechVideos } from './TrendingTechVideos';
import { ChatSidebar } from './ChatSidebar';
import { Search, User, ChevronDown } from 'lucide-react';

type TabType = 'discover' | 'dashboard';

interface MyDashboardProps {
  showChat?: boolean;
  initialTab?: TabType;
}

export const MyDashboard: React.FC<MyDashboardProps> = ({ 
  showChat = true,
  initialTab = 'discover'
}) => {
  const [activeTab, setActiveTab] = React.useState<TabType>(initialTab);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortBy, setSortBy] = React.useState('relevance');
  const [duration, setDuration] = React.useState('any');

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-8">
            <div className="flex items-center gap-8">
              <Tab
                icon={<Search />}
                label="Discover"
                subtitle="Trending content"
                isActive={activeTab === 'discover'}
                onClick={() => setActiveTab('discover')}
              />
              <Tab
                icon={<User />}
                label="Shruti's YouTube Dashboard"
                subtitle="Personal metrics"
                isActive={activeTab === 'dashboard'}
                onClick={() => setActiveTab('dashboard')}
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-8 py-8">
            {activeTab === 'discover' && (
              <div className="space-y-8">
                {/* Search and Filters */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search for a video"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                      <span className="text-sm text-gray-700">Sort by</span>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>
                    
                    <button className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                      <span className="text-sm text-gray-700">Duration</span>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Trending Videos */}
                <TrendingTechVideos />
              </div>
            )}

            {activeTab === 'dashboard' && (
              <div className="bg-white rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal Metrics</h2>
                <p className="text-gray-600">Your YouTube analytics and metrics will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      {showChat && <ChatSidebar />}
    </div>
  );
};

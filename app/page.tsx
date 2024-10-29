'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import Logo from '../public/images/Logo Learnitab.png';
import { FiSearch, FiBriefcase, FiAward, FiBookOpen, FiUsers, FiChevronDown, FiHeart, FiMessageSquare, FiYoutube, FiLinkedin, FiInstagram, FiLink, FiMenu, FiCalendar, FiTrash2, FiRotateCw } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { Post } from '@/types/Post';
import { useSearchParams } from 'next/navigation';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';
import { ErrorBoundary } from 'react-error-boundary';
import dynamic from 'next/dynamic'

type CalendarEvent = {
  id: string;
  title: string;
  deadline: string;
};

type ErrorFallbackProps = {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({error, resetErrorBoundary}: ErrorFallbackProps) {
  console.error('ErrorBoundary caught error:', error); // Add this line
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <pre className="mt-2 text-red-500">{error.message}</pre>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white"
        onClick={resetErrorBoundary}
      >
        Try again
      </button>
    </div>
  );
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [recommendations, setRecommendations] = useState<Post[]>([]);
  const [currentCategory, setCurrentCategory] = useState('');
  const [selectedPostTitle, setSelectedPostTitle] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSaved, setShowSaved] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [visiblePosts, setVisiblePosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const postsPerPage = 10;
  const listRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [urlPostId, setUrlPostId] = useState<string | null>(null);
  const [showCalendarPanel, setShowCalendarPanel] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Post | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [showCalendarManagement, setShowCalendarManagement] = useState(false);
  const [sortOrder, setSortOrder] = useState<'latest' | 'newest'>('latest');
  const [filterDays, setFilterDays] = useState<number | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const filterPosts = useCallback(() => {
    return posts.filter(post => {
      const matchesCategory = currentCategory === '' || post.category.toLowerCase() === currentCategory.toLowerCase();
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (typeof post.body === 'string' && post.body.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (Array.isArray(post.body) && post.body.some(item => typeof item === 'string' && item.toLowerCase().includes(searchTerm.toLowerCase())));
      
      return matchesCategory && matchesSearch;
    });
  }, [posts, currentCategory, searchTerm]);

  const loadMorePosts = useCallback(() => {
    const filteredPosts = filterPosts();
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const newPosts = filteredPosts.slice(startIndex, endIndex);

    if (newPosts.length > 0) {
      setVisiblePosts(prevPosts => [...prevPosts, ...newPosts]);
      setPage(prevPage => prevPage + 1);
    } else {
      setHasMore(false);
    }
  }, [filterPosts, page, postsPerPage]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const processedData = data.map((post: Post) => ({
          ...post,
          category: post.category?.toLowerCase() || '', // Add null check
          expired: new Date(post.deadline || '').getTime() < new Date().getTime(),
          daysLeft: Math.ceil((new Date(post.deadline || '').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        }));
        setPosts(processedData);
      } catch (error) {
        console.error('Error fetching posts:', error); // Add detailed error logging
        setPosts([]); // Set empty array instead of crashing
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    setVisiblePosts([]);
    setPage(1);
    setHasMore(true);
  }, [currentCategory, searchTerm]);

  useEffect(() => {
    if (posts.length > 0) {
      loadMorePosts();
    }
  }, [posts, loadMorePosts]);

  useEffect(() => {
    if (inView && hasMore) {
      loadMorePosts();
    }
  }, [inView, hasMore, loadMorePosts]);

  const handleScroll = useCallback(() => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore) {
        loadMorePosts();
      }
    }
  }, [hasMore, loadMorePosts]);

  useEffect(() => {
    const currentListRef = listRef.current;
    if (currentListRef) {
      currentListRef.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (currentListRef) {
        currentListRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  const categories = ['', 'internship', 'competitions', 'scholarships', 'mentors'];

  const displayFullPost = useCallback((post: Post) => {
    setSelectedPostTitle(post.title);
    setShowWelcome(false);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'internship':
        return <FiBriefcase className="mr-2" />;
      case 'competitions':
        return <FiAward className="mr-2" />;
      case 'scholarships':
        return <FiBookOpen className="mr-2" />;
      case 'mentors':
        return <FiUsers className="mr-2" />;
      default:
        return null;
    }
  };

  const generateRecommendations = useCallback(() => {
    // This is a simple recommendation algorithm. In a real-world scenario,
    // you'd want to use more sophisticated methods, possibly involving machine learning.
    const recommendedPosts = posts.filter(post => 
      userInterests.some(interest => 
        post.title.toLowerCase().includes(interest) || 
        post.category.toLowerCase().includes(interest) ||
        (typeof post.body === 'string' && post.body.toLowerCase().includes(interest))
      )
    ).slice(0, 3); // Limit to 3 recommendations

    setRecommendations(recommendedPosts);
  }, [posts, userInterests]);

  useEffect(() => {
    // In a real application, you'd fetch the user's interests from a backend
    // For now, we'll simulate it with some hardcoded interests
    setUserInterests(['data science', 'finance', 'technology']);
  }, []);

  useEffect(() => {
    if (posts.length > 0 && userInterests.length > 0) {
      generateRecommendations();
    }
  }, [posts, userInterests, generateRecommendations]);

  // Update the copyPostLink function
  const copyPostLink = (post: Post) => {
    const link = `${window.location.origin}/?id=${post._id}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(post.title);
      setTimeout(() => setCopiedLink(null), 2000);
    });
  };

  const toggleFavorite = (postTitle: string) => {
    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.includes(postTitle)
        ? prevFavorites.filter(title => title !== postTitle)
        : Array.from(new Set([...prevFavorites, postTitle]));
      
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const toggleShowSaved = () => {
    setShowSaved(!showSaved);
    setSelectedPostTitle(null);
    setShowWelcome(true); // Show welcome screen when toggling saved mode
  };

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(Array.from(new Set(JSON.parse(storedFavorites)))); // Remove duplicates
    }
  }, []);

  // Update the effect that handles URL parameters
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setUrlPostId(id);
    }
  }, [searchParams]);

  // Add this effect to handle opening the correct post once posts are loaded
  useEffect(() => {
    if (urlPostId && posts.length > 0) {
      const post = posts.find(p => p._id === urlPostId);
      if (post) {
        setSelectedPostTitle(post.title);
        setShowWelcome(false);
        setShowBanner(false);
      }
      setUrlPostId(null); // Reset after handling
    }
  }, [urlPostId, posts]);

  const toggleCalendarPanel = (post?: Post) => {
    if (post) {
      setSelectedEvent(post);
      setShowCalendarPanel(true);
      setIsOverlayVisible(true);
    } else {
      setShowCalendarManagement(!showCalendarManagement);
      setShowCalendarPanel(false);
      setSelectedEvent(null);
      setIsOverlayVisible(!showCalendarManagement);
    }
  };

  const addToCalendar = (post: Post) => {
    const newEvent: CalendarEvent = {
      id: post._id,
      title: post.title,
      deadline: post.deadline ?? 'No deadline specified',
    };
    setCalendarEvents(prevEvents => {
      const updatedEvents = [...prevEvents, newEvent];
      localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
      return updatedEvents;
    });
    setShowCalendarPanel(false);
    setSelectedEvent(null);
  };

  const removeFromCalendar = (eventId: string) => {
    setCalendarEvents(prevEvents => {
      const updatedEvents = prevEvents.filter(event => event.id !== eventId);
      localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
      return updatedEvents;
    });
  };

  useEffect(() => {
    const storedEvents = localStorage.getItem('calendarEvents');
    if (storedEvents) {
      setCalendarEvents(JSON.parse(storedEvents));
    }
  }, []);

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'latest' ? 'newest' : 'latest');
  };

  const sortPosts = useCallback((postsToSort: Post[]) => {
    return [...postsToSort].sort((a, b) => {
      // Extract timestamp from MongoDB ObjectId
      const timestampA = parseInt(a._id.substring(0, 8), 16);
      const timestampB = parseInt(b._id.substring(0, 8), 16);
      return sortOrder === 'latest' ? timestampB - timestampA : timestampA - timestampB;
    });
  }, [sortOrder]);

  const renderPosts = useCallback((postsToRender: Post[]) => {
    const sortedPosts = sortPosts(postsToRender);
    return sortedPosts.map((post, index) => (
      <div key={`${post._id}-${index}`}>
        <div
          className={`p-4 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 ${
            selectedPostTitle === post.title
              ? 'bg-blue-100 border-l-4 border-blue-500'
              : 'hover:bg-gray-100 hover:shadow-md'
          }`}
          onClick={() => displayFullPost(post)}
        >
          <div className="flex items-center mb-2">
            <Image
              src={post.image}
              alt={post.title}
              width={48}
              height={48}
              className="rounded-full mr-3 object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900 line-clamp-1">{post.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-1">
                {post.category === 'mentors' ? post.labels['Organization'] : post.labels['Company']}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-900 text-white">
              {post.category}
            </span>
            {post.expired ? (
              <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-red-500 text-white">
                Expired
              </span>
            ) : post.category !== 'mentors' && post.category !== 'internship' && (
              <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-500 text-white">
                {post.daysLeft} days left
              </span>
            )}
          </div>
        </div>
        {index < sortedPosts.length - 1 && (
          <hr className="my-2 border-gray-200" />
        )}
      </div>
    ));
  }, [sortPosts, selectedPostTitle, displayFullPost]);

  useEffect(() => {
    setVisiblePosts(prevPosts => [...prevPosts]); // Trigger re-render when sort order changes
  }, [sortOrder]);

  const selectCategory = (category: string) => {
    setCurrentCategory(category);
    setShowSaved(false);  // Turn off saved mode
    setShowWelcome(false);
  };

  const WelcomeScreen = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <Image
        src="https://od.lk/s/OTZfOTUyNTU0MTlf/Grand_Design_Learnitab_Page_1-min.png"
        alt="Banner"
        width={800}
        height={400}
        className="w-full rounded-lg shadow-md"
      />
      <h2 className="text-2xl font-bold mt-6 mb-4">Welcome to Learnitab</h2>
      <p className="text-gray-600 mb-4">
        Discover amazing opportunities for internships, competitions, scholarships, and mentorship. 
        Start your journey by selecting a category or searching for specific opportunities.
      </p>
      <div className="flex flex-wrap gap-4 mt-6">
        {categories.map((category) => (
          <button
            key={category}
            className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-900 hover:bg-blue-200 transition-colors duration-200"
            onClick={() => selectCategory(category)}
          >
            <span className="relative">
              {getCategoryIcon(category)}
            </span>
            <span className="ml-2">
              {category === '' ? 'All Opportunities' : category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  const sortedEvents = calendarEvents.sort((a, b) => {
    const dateA = parseISO(a.deadline);
    const dateB = parseISO(b.deadline);
    return sortOrder === 'latest' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
  });

  const filteredEvents = filterDays
    ? sortedEvents.filter(event => {
        const eventDate = parseISO(event.deadline);
        return isBefore(eventDate, addDays(new Date(), filterDays));
      })
    : sortedEvents;

  // Add loading state render
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  useEffect(() => {
    const debugInfo = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        console.log('API Response:', data);
      } catch (error) {
        console.error('API Error:', error);
      }
    };
    debugInfo();
  }, []);

  if (typeof window === 'undefined') {
    return null; // Prevents hydration issues
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply opacity-70 animate-blob animation-delay-4000"></div>

        <header className="bg-white bg-opacity-90 shadow-lg sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
                  <Image
                    src={Logo}
                    alt="Learnitab Logo"
                    width={40}
                    height={40}
                    className="relative z-10 mr-4"
                  />
                </div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Learnitab</h1>
              </div>
              <nav className="hidden md:flex space-x-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative ${
                      currentCategory === category
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transform scale-105'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => selectCategory(category)}
                  >
                    {getCategoryIcon(category)}
                    <span>
                      {category === '' ? 'All Opportunities' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </span>
                    {category === 'mentors' && (
                      <div className="absolute -bottom-3 -right-8 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full transform rotate-12">
                        100% FREE
                      </div>
                    )}
                  </button>
                ))}
              </nav>
              <button 
                className="md:hidden text-blue-900"
                onClick={() => {/* Toggle mobile menu */}}
              >
                <FiMenu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex flex-col md:flex-row min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8 py-8 space-y-8 md:space-y-0 md:space-x-8 relative z-10">
          {/* Left column */}
          <div className="w-full md:w-2/5 flex flex-col">
            {/* Search bar, Saved button, and Calendar button */}
            <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-4 mb-4 transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-stretch justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative flex-grow">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-gray-700 bg-opacity-50"
                    placeholder="Search opportunities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={toggleShowSaved}
                    className={`flex items-center justify-center px-3 py-1 rounded-md transition-all duration-200 text-xs font-medium shadow-sm ${
                      showSaved 
                        ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600' 
                        : 'bg-white text-pink-500 border border-pink-500 hover:bg-pink-50'
                    }`}
                  >
                    <FiHeart className={`mr-1 ${showSaved ? 'fill-current' : ''}`} />
                    {favorites.length}
                  </button>
                  <button
                    onClick={() => toggleCalendarPanel()}
                    className={`flex items-center justify-center px-3 py-1 rounded-md transition-all duration-200 text-xs font-medium shadow-sm ${
                      showCalendarManagement 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600' 
                        : 'bg-white text-blue-500 border border-blue-500 hover:bg-blue-50'
                    }`}
                  >
                    <FiCalendar className="mr-1" />
                    {calendarEvents.length}
                  </button>
                </div>
              </div>
            </div>

            {/* Opportunities list or Calendar Management */}
            <div 
              ref={listRef}
              className="flex-1 overflow-y-auto custom-scrollbar bg-white bg-opacity-90 rounded-lg shadow-lg p-4 transition-all duration-300"
              style={{ maxHeight: 'calc(100vh - 240px)' }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {showSaved ? 'Saved Opportunities' : 'Opportunities'}
                </h2>
                <button
                  onClick={toggleSortOrder}
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  title={`Sort by ${sortOrder === 'latest' ? 'newest' : 'latest'}`}
                >
                  <FiRotateCw className="w-5 h-5 mr-1" />
                  {sortOrder === 'latest' ? 'Latest' : 'Newest'}
                </button>
              </div>
              <div className="space-y-4">
                {showSaved
                  ? renderPosts(posts.filter(post => favorites.includes(post.title)))
                  : renderPosts(visiblePosts)
                }
                {hasMore && !showSaved && (
                  <div ref={ref} className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="w-full md:w-3/5 overflow-y-auto custom-scrollbar bg-white bg-opacity-90 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all duration-300" style={{ maxHeight: 'calc(100vh - 160px)' }}>
            {showWelcome ? (
              <WelcomeScreen />
            ) : selectedPostTitle && (
              <div className="bg-white rounded-lg shadow-md p-6">
                {posts.filter(post => post.title === selectedPostTitle).map(post => (
                  <div key={post._id}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                      <div className="flex items-center mb-4 sm:mb-0">
                        <Image
                          src={post.image}
                          alt={post.title}
                          width={80}
                          height={80}
                          className="rounded-full mr-5 object-cover"
                        />
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-1">{post.title}</h2>
                          <p className="text-lg text-gray-600">
                            {post.category === 'mentors' ? post.labels['Organization'] : post.labels['Company']}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedPostTitle(null)} 
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <IoMdClose size={24} />
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                      <div className="flex space-x-4">
                        {post.category === 'mentors' && (
                          <>
                            <a href={post.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-900 hover:text-blue-700 transition-colors duration-200">
                              <FiLinkedin className="w-6 h-6" />
                            </a>
                            <a href={post.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-900 hover:text-blue-700 transition-colors duration-200">
                              <FiInstagram className="w-6 h-6" />
                            </a>
                          </>
                        )}
                        <button 
                          onClick={() => toggleFavorite(post.title)}
                          className={`transition-colors duration-200 ${
                            favorites.includes(post.title) ? 'text-pink-500' : 'text-blue-900 hover:text-blue-700'
                          }`}
                        >
                          <FiHeart className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() => copyPostLink(post)}
                          className="text-blue-900 hover:text-blue-700 transition-colors duration-200"
                          title="Copy link to opportunity"
                        >
                          <FiLink className="w-6 h-6" />
                        </button>
                        {(post.category === 'competitions' || post.category === 'scholarships') && (
                          <button
                            onClick={() => toggleCalendarPanel(post)}
                            className="text-blue-900 hover:text-blue-700 transition-colors duration-200"
                            title="Add to calendar"
                          >
                            <FiCalendar className="w-6 h-6" />
                          </button>
                        )}
                      </div>
                      <a
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-6 py-3 bg-blue-900 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-center"
                      >
                        {post.category === 'mentors' ? 'Schedule Mentoring' : 'Apply Now'}
                      </a>
                    </div>

                    <hr className="my-6 border-gray-200" />

                    {post.category === 'mentors' && (
                      <>
                        <div className="mb-6">
                          <h3 className="text-xl font-semibold mb-3">Mentoring Topics</h3>
                          <div className="flex flex-wrap gap-2">
                            {(post.labels['Mentoring Topic'] as string[] ?? []).map((topic: string) => (
                              <span key={topic} className="px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-sm">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>

                        <hr className="my-6 border-gray-200" />

                        <div className="mb-6">
                          <h3 className="text-xl font-semibold mb-3">Experience</h3>
                          <ul className="list-disc pl-5 space-y-2">
                            {post.experience ? post.experience.map((exp: string, index: number) => (
                              <li key={index}>{exp}</li>
                            )) : <li>No experience listed</li>}
                          </ul>
                        </div>

                        <hr className="my-6 border-gray-200" />

                        <div className="mb-6">
                          <h3 className="text-xl font-semibold mb-3">Education</h3>
                          <ul className="list-disc pl-5 space-y-2">
                            {post.education ? post.education.map((edu: string, index: number) => (
                              <li key={index}>{edu}</li>
                            )) : <li>No education listed</li>}
                          </ul>
                        </div>
                      </>
                    )}

                    {post.category === 'internship' && (
                      <>
                        <div className="mb-6">
                          <h3 className="text-xl font-semibold mb-3">Responsibilities</h3>
                          <ul className="list-disc pl-5 space-y-2">
                            {post.responsibilities ? post.responsibilities.map((res: string, index: number) => (
                              <li key={index}>{res}</li>
                            )) : <li>No responsibilities listed</li>}
                          </ul>
                        </div>

                        <hr className="my-6 border-gray-200" />

                        <div className="mb-6">
                          <h3 className="text-xl font-semibold mb-3">Requirements</h3>
                          <ul className="list-disc pl-5 space-y-2">
                            {post.requirements ? post.requirements.map((req: string, index: number) => (
                              <li key={index}>{req}</li>
                            )) : <li>No requirements listed</li>}
                          </ul>
                        </div>

                        <hr className="my-6 border-gray-200" />

                        <div className="mb-6">
                          <h3 className="text-xl font-semibold mb-3">Additional Information</h3>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(post.labels).map(([key, value]) => {
                              if (key !== 'Company' && key !== 'Position' && key !== 'Status') {
                                return Array.isArray(value) ? value.map(v => (
                                  <span key={v} className="px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-sm">
                                    {v}
                                  </span>
                                )) : (
                                  <span key={key} className="px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-sm">
                                    {value}
                                  </span>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </div>
                      </>
                    )}

                    {post.category !== 'mentors' && post.category !== 'internship' && (
                      <>
                        <div className="mb-6">
                          <h3 className="text-xl font-semibold mb-3">{post.category.charAt(0).toUpperCase() + post.category.slice(1)} Details</h3>
                          {Array.isArray(post.body) ? post.body.map((line, index) => (
                            <p key={index} className="mb-2">{line}</p>
                          )) : <p>No details available</p>}
                        </div>

                        <hr className="my-6 border-gray-200" />

                        <div className="mb-6">
                          <h3 className="text-xl font-semibold mb-3">Additional Information</h3>
                          <p className="mb-2"><strong>Deadline:</strong> {post.deadline || 'Not specified'}</p>
                          <p className="mb-2"><strong>Location:</strong> {post.location || 'Not specified'}</p>
                          <p><strong>Contact:</strong> {post.email || 'No email provided'}{post.phone ? `, ${post.phone}` : ''}</p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {isOverlayVisible && (
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-40"
            onClick={() => {
              setShowCalendarPanel(false);
              setShowCalendarManagement(false);
              setIsOverlayVisible(false);
            }}
          ></div>
        )}

        {/* Calendar Side Panel */}
        {showCalendarPanel && selectedEvent && (
          <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-lg p-6 transform transition-transform duration-300 ease-in-out z-50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add to Calendar</h2>
              <button onClick={() => {
                setShowCalendarPanel(false);
                setIsOverlayVisible(false);
              }} className="text-gray-500 hover:text-gray-700">
                <IoMdClose size={24} />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Add this opportunity's deadline to your calendar:</p>
              <h3 className="font-semibold mb-2">{selectedEvent.title}</h3>
              <p className="text-sm mb-4">Deadline: {selectedEvent.deadline}</p>
            </div>
            <button
              onClick={() => addToCalendar(selectedEvent)}
              className="w-full bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600 transition-colors duration-200"
            >
              Add to Calendar
            </button>
          </div>
        )}

        {/* Calendar Management Panel */}
        {showCalendarManagement && (
          <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-lg p-6 transform transition-transform duration-300 ease-in-out z-50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Calendar Management</h2>
              <button onClick={() => {
                setShowCalendarManagement(false);
                setIsOverlayVisible(false);
              }} className="text-gray-500 hover:text-gray-700">
                <IoMdClose size={24} />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by days:</label>
              <select
                value={filterDays || ''}
                onChange={(e) => setFilterDays(e.target.value ? Number(e.target.value) : null)}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
              >
                <option value="">All events</option>
                <option value="7">Next 7 days</option>
                <option value="30">Next 30 days</option>
                <option value="90">Next 90 days</option>
              </select>
            </div>
            <div className="space-y-4">
              {calendarEvents
                .filter(event => !filterDays || isAfter(parseISO(event.deadline), new Date()) && isBefore(parseISO(event.deadline), addDays(new Date(), filterDays)))
                .map(event => (
                  <div key={event.id} className="flex justify-between items-center p-3 bg-gray-100 rounded-md">
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-600">{format(parseISO(event.deadline), 'MMM dd, yyyy')}</p>
                    </div>
                    <button
                      onClick={() => removeFromCalendar(event.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Mobile category menu */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-md">
          <div className="flex justify-around py-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`flex flex-col items-center px-3 py-2 rounded-md text-xs font-medium ${
                  currentCategory === category
                    ? 'text-blue-900'
                    : 'text-gray-700'
                }`}
                onClick={() => selectCategory(category)}
              >
                <span className="relative">
                  {getCategoryIcon(category)}
                </span>
                <span className="mt-1">
                  {category === '' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1, 3)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <style jsx global>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(241, 241, 241, 0.5);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(136, 136, 136, 0.5);
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(85, 85, 85, 0.5);
          }
        `}</style>
      </div>
    </ErrorBoundary>
  );
}
function setShowBanner(arg0: boolean) {
  throw new Error('Function not implemented.');
}


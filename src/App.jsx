import React, { useState, useEffect } from 'react';
import { 
  Trophy, Shield, Play, ThumbsUp, MessageSquare, AlertTriangle, 
  Upload, Search, Award, CheckCircle, Video, UserCheck, Flame, Plus, X 
} from 'lucide-react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [posts, setPosts] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showScoutModal, setShowScoutModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [category, setCategory] = useState('Sports');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isMinor, setIsMinor] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');

  // Load posts from localStorage on initial render
  useEffect(() => {
    const savedPosts = localStorage.getItem('kht_posts');
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (e) {
        console.error('Error loading posts:', e);
      }
    }
  }, []);

  // Save posts to localStorage whenever they update
  const savePostsToStorage = (updatedPosts) => {
    setPosts(updatedPosts);
    localStorage.setItem('kht_posts', JSON.stringify(updatedPosts));
  };

  const categories = ['All', 'Sports', 'Academics & Tech', 'Chess & Strategy', 'Performing Arts'];

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!title || !creatorName || !videoPreview) {
      alert('Please fill in all required fields and upload a video file.');
      return;
    }

    const newPost = {
      id: Date.now(),
      title,
      creatorName,
      category,
      description,
      location: location || 'Kenya',
      isMinor,
      videoUrl: videoPreview,
      applauds: 0,
      createdAt: new Date().toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }),
      commentsCount: 0
    };

    const updated = [newPost, ...posts];
    savePostsToStorage(updated);

    // Reset Form
    setTitle('');
    setCreatorName('');
    setDescription('');
    setLocation('');
    setIsMinor(false);
    setVideoFile(null);
    setVideoPreview('');
    setShowUploadModal(false);
  };

  const handleApplaud = (id) => {
    const updated = posts.map(post => {
      if (post.id === id) {
        return { ...post, applauds: post.applauds + 1 };
      }
      return post;
    });
    savePostsToStorage(updated);
  };

  const filteredPosts = activeCategory === 'All' 
    ? posts 
    : posts.filter(p => p.category === activeCategory);

  const topLeaderboard = [...posts].sort((a, b) => b.applauds - a.applauds).slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-red-600 via-green-600 to-emerald-500 p-2 rounded-xl text-white font-black text-xl tracking-wider">
              KHT
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Kenya Has Talent
              </h1>
              <p className="text-xs text-slate-400 font-medium">Showcase. Connect. Get Discovered.</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowScoutModal(true)}
              className="hidden sm:flex items-center space-x-1 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium border border-slate-700 transition"
            >
              <UserCheck size={14} className="text-emerald-400" />
              <span>Scout Access</span>
            </button>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition shadow-lg shadow-emerald-900/40"
            >
              <Plus size={18} />
              <span>Share Talent</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left/Center Feed (3 Cols) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950 via-slate-900 to-emerald-950 border border-slate-800 p-6 sm:p-8">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
                <Flame size={14} />
                <span>2026 Talent Discovery Platform</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
                Empowering Kenya's Next Generation of Greatness
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mb-4">
                From chess grandmasters and coders to sprinters and performers. Upload your clip, build your portfolio, and get noticed by verified talent scouts.
              </p>
              <div className="flex items-center space-x-4 text-xs text-slate-400">
                <span className="flex items-center space-x-1">
                  <Shield size={14} className="text-emerald-400" />
                  <span>Youth DM Safety Active</span>
                </span>
                <span className="flex items-center space-x-1">
                  <CheckCircle size={14} className="text-blue-400" />
                  <span>Verified Scouts</span>
                </span>
              </div>
            </div>
          </div>

          {/* Category Filter Bar */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  activeCategory === cat
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Feed Grid */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800 p-8">
              <Video size={48} className="mx-auto text-slate-600 mb-3" />
              <h3 className="text-lg font-bold text-slate-300 mb-1">No Submissions Yet</h3>
              <p className="text-xs text-slate-500 mb-4">Be the very first talent to publish a video on KHT!</p>
              <button 
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition"
              >
                Upload First Video
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between group hover:border-slate-700 transition">
                  <div>
                    {/* Video Player */}
                    <div className="relative aspect-video bg-black">
                      <video 
                        src={post.videoUrl} 
                        controls 
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-emerald-400 uppercase tracking-wider border border-slate-800">
                        {post.category}
                      </span>
                      {post.isMinor && (
                        <span className="absolute top-3 right-3 bg-amber-500/20 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-medium text-amber-300 border border-amber-500/30 flex items-center space-x-1">
                          <Shield size={10} />
                          <span>Under 18 (DMs Blocked)</span>
                        </span>
                      )}
                    </div>

                    {/* Post Content */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-white line-clamp-1">{post.title}</h4>
                          <p className="text-xs text-slate-400 font-medium">By {post.creatorName} • {post.location}</p>
                        </div>
                        <button 
                          onClick={() => { setSelectedPost(post); setShowReportModal(true); }}
                          className="text-slate-500 hover:text-red-400 transition p-1"
                          title="Report content"
                        >
                          <AlertTriangle size={14} />
                        </button>
                      </div>
                      {post.description && (
                        <p className="text-xs text-slate-300 line-clamp-2">{post.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Post Footer Actions */}
                  <div className="p-4 pt-0 border-t border-slate-800/60 mt-3 flex items-center justify-between">
                    <button 
                      onClick={() => handleApplaud(post.id)}
                      className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition bg-emerald-950/40 hover:bg-emerald-900/40 px-3 py-1.5 rounded-lg border border-emerald-800/40"
                    >
                      <ThumbsUp size={14} />
                      <span>Applaud ({post.applauds})</span>
                    </button>
                    <span className="text-[11px] text-slate-500">{post.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar (1 Col) - Leaderboard & Safety */}
        <div className="space-y-6">
          
          {/* Real-time Leaderboard */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
            <div className="flex items-center space-x-2 mb-4">
              <Trophy className="text-amber-400" size={20} />
              <h3 className="font-bold text-sm text-white">Live Leaderboard</h3>
            </div>

            {topLeaderboard.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No rankings yet. Start applauding posts!</p>
            ) : (
              <div className="space-y-3">
                {topLeaderboard.map((item, idx) => (
                  <div key={item.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-950/50 border border-slate-800/50">
                    <div className="flex items-center space-x-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        idx === 0 ? 'bg-amber-500 text-black' :
                        idx === 1 ? 'bg-slate-300 text-black' :
                        idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-white line-clamp-1">{item.title}</p>
                        <p className="text-[10px] text-slate-400">{item.creatorName}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">{item.applauds} pts</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Safety & Trust Box */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-3">
            <div className="flex items-center space-x-2 text-emerald-400">
              <Shield size={18} />
              <h4 className="font-bold text-xs uppercase tracking-wider">Safety First</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kenya Has Talent enforces strict minor protections. Accounts marked Under 18 have direct messaging disabled by default. All scout access is verified manually.
            </p>
          </div>

          <footer className="text-center text-[11px] text-slate-600 pt-2">
            © 2026 Kenya Has Talent (KHT). All rights reserved.
          </footer>
        </div>
      </main>

      {/* Upload Talent Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">Share Your Talent Clip</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Title of Showcase *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Solving 5 Chess Puzzles under 60s"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Creator Name *</label>
                  <input 
                    type="text" 
                    placeholder="Your name or handle"
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">County / Location</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Nairobi, Embu, Kisumu"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isMinor}
                      onChange={(e) => setIsMinor(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-emerald-600 focus:ring-0"
                    />
                    <span className="text-slate-300">Creator is under 18 years old</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description / Project Details</label>
                <textarea 
                  rows={3}
                  placeholder="Tell us what you're showcasing..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Upload Video File *</label>
                <input 
                  type="file" 
                  accept="video/*"
                  onChange={handleVideoSelect}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-400 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-emerald-600 file:text-white file:text-xs file:font-semibold hover:file:bg-emerald-500"
                  required
                />
              </div>

              {videoPreview && (
                <div className="mt-2">
                  <p className="text-[11px] text-emerald-400 mb-1">Preview Video:</p>
                  <video src={videoPreview} controls className="w-full max-h-40 rounded-lg bg-black object-contain" />
                </div>
              )}

              <button 
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-950"
              >
                Publish Talent Video
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Scout Registration Modal */}
      {showScoutModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">Scout & Recruiter Verification</h3>
              <button onClick={() => setShowScoutModal(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Are you an athletic scout, university club representative, or tech mentor looking for talented youth across Kenya? Submit your verification details below.
            </p>
            <input 
              type="text" 
              placeholder="Organization / Institution Name"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
            />
            <input 
              type="email" 
              placeholder="Official Contact Email"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
            />
            <button 
              onClick={() => { alert('Scout verification request submitted successfully!'); setShowScoutModal(false); }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl"
            >
              Submit Scout Request
            </button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">Flag Content</h3>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Help keep Kenya Has Talent safe. Why are you reporting "{selectedPost?.title}"?
            </p>
            <select className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white">
              <option>Inappropriate Content</option>
              <option>Copyright Infringement</option>
              <option>Fake / Misleading Post</option>
              <option>Bullying or Harassment</option>
            </select>
            <button 
              onClick={() => { alert('Report received. Our moderation team will review this post.'); setShowReportModal(false); }}
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl"
            >
              Submit Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

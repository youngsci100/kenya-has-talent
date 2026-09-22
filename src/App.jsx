import React, { useState, useEffect } from 'react';
import { Trophy, Award, Search, PlusCircle, ThumbsUp, Video, Sparkles, Filter, ShieldCheck } from 'lucide-react';

const CATEGORIES = ["All", "Sports", "Academics & Tech", "Chess & Strategy", "Performing Arts", "Creative Arts"];

export default function App() {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [creator, setCreator] = useState("");
  const [category, setCategory] = useState("Performing Arts");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);

  // Load existing posts from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('kht_talent_posts');
    if (saved) {
      try {
        setPosts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved posts", e);
      }
    }
  }, []);

  // Save to local storage whenever posts change
  const savePosts = (updatedPosts) => {
    setPosts(updatedPosts);
    localStorage.setItem('kht_talent_posts', JSON.stringify(updatedPosts));
  };

  // Helper to generate a unique KHT Talent ID
  const generateKhtId = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `KHT-KE-${randomNum}`;
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !creator) return;

    const newPost = {
      id: Date.now(),
      khtId: generateKhtId(),
      title,
      creator,
      category,
      description,
      videoUrl: videoFile || "https://assets.mixkit.co/videos/preview/mixkit-basketball-player-dunking-a-ball-41584-large.mp4",
      applause: 0,
      createdAt: new Date().toLocaleDateString()
    };

    const updated = [newPost, ...posts];
    savePosts(updated);

    // Reset Form
    setTitle("");
    setCreator("");
    setDescription("");
    setCategory("Performing Arts");
    setVideoFile(null);
    setIsModalOpen(false);
  };

  const handleApplause = (id) => {
    const updated = posts.map(post => {
      if (post.id === id) {
        return { ...post, applause: post.applause + 1 };
      }
      return post;
    });
    savePosts(updated);
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.khtId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header / Nav */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
              KHT
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none tracking-tight">Kenya Has Talent</h1>
              <p className="text-xs text-slate-400 mt-1">Showcase. Connect. Get Discovered.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-4 py-2 rounded-lg transition shadow-md shadow-emerald-500/10 text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Share Your Talent</span>
            </button>
            
            <button className="hidden sm:flex items-center gap-2 border border-slate-700 hover:bg-slate-800 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 transition">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Scout Access</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Search & Category Filter */}
        <section className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search talent name, title, or KHT ID (e.g. KHT-KE-123456)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  selectedCategory === cat 
                    ? "bg-emerald-500/10 border border-emerald-500 text-emerald-400" 
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Talent Spotlight Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold tracking-tight">Talent Spotlight</h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {filteredPosts.length} Registered {filteredPosts.length === 1 ? 'Profile' : 'Profiles'}
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="border border-dashed border-slate-800 bg-slate-900/50 rounded-2xl p-12 text-center my-12 max-w-md mx-auto">
              <Sparkles className="w-10 h-10 text-emerald-400/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-200 mb-1">No Submissions Yet</h3>
              <p className="text-sm text-slate-400 mb-6">Be the very first talent to feature your portfolio or demonstration on KHT!</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium px-5 py-2.5 rounded-lg text-sm transition"
              >
                Share Your Talent
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map(post => (
                <div 
                  key={post.id} 
                  className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition flex flex-col justify-between"
                >
                  <div>
                    {/* Video Player */}
                    <div className="relative aspect-video bg-slate-950">
                      <video 
                        src={post.videoUrl} 
                        controls 
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Card Body */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-semibold">
                          {post.khtId}
                        </span>
                        <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full font-medium">
                          {post.category}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-100 line-clamp-1">{post.title}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">By <span className="text-slate-200 font-medium">{post.creator}</span></p>
                      </div>

                      {post.description && (
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {post.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-4 pt-0 border-t border-slate-800/60 mt-2 flex items-center justify-between">
                    <button 
                      onClick={() => handleApplause(post.id)}
                      className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-emerald-400 bg-slate-800/60 hover:bg-slate-800 px-3 py-1.5 rounded-md transition"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Applaud ({post.applause})</span>
                    </button>
                    <span className="text-[11px] text-slate-500">{post.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-lg">Share Your Talent</h3>
                <p className="text-xs text-slate-400">Your profile will receive an official KHT reference code.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-sm p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Talent / Project Title *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Speed Chess Walkthrough, 3D Web App, Original Beat"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Your Name / Creator *</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Alex N."
                    value={creator}
                    onChange={(e) => setCreator(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-slate-200"
                  >
                    {CATEGORIES.filter(c => c !== "All").map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description / Proof Details</label>
                <textarea 
                  rows="2"
                  placeholder="Briefly describe your skill, proof of work, or rules..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Video / Project Clip</label>
                <input 
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-400 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-4 py-2 rounded-lg text-xs transition"
                >
                  Register Profile & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

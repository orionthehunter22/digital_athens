import React, { useState } from 'react';

export default function SearchIsland() {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;
        setIsSearching(true);
        setTimeout(() => {
            setIsSearching(false);
            setQuery('');
        }, 1500);
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-10 relative group z-20">
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-lg blur opacity-20 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <form onSubmit={handleSearch} className="relative flex items-center bg-black/80 rounded-lg p-2 border border-white/10 backdrop-blur-md overflow-hidden">
                <span className="pl-4 text-neon-cyan opacity-80 text-xl font-bold">⌘</span>
                <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Query the Oracle..."
                    className="w-full bg-transparent border-none text-[#e0e0e0] font-body px-4 py-3 focus:outline-none placeholder-gray-600 selection:bg-neon-purple/50"
                />
                <button 
                    type="submit" 
                    className="px-6 py-2 bg-neon-cyan/5 text-neon-cyan font-display uppercase tracking-widest text-xs border border-neon-cyan/30 rounded hover:bg-neon-cyan hover:text-black hover:shadow-[0_0_15px_rgba(0,240,255,0.6)] transition-all duration-300"
                    disabled={isSearching}
                >
                    {isSearching ? 'Processing...' : 'Search'}
                </button>
            </form>
            
            {/* Holographic Search Results Overlay */}
            {isSearching && (
                <div className="absolute top-16 left-0 right-0 bg-black/90 border border-neon-cyan/30 rounded p-4 text-center font-mono text-sm text-neon-cyan animate-pulse shadow-[0_4px_30px_rgba(0,240,255,0.15)] flex items-center justify-center gap-3">
                    <span className="inline-block w-4 h-4 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin"></span>
                    Consulting NotebookLM embeddings for '<span className="text-white">{query}</span>'...
                </div>
            )}
        </div>
    );
}

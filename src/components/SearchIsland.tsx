import React, { useState, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';

interface SearchResult {
    slug: string;
    title: string;
    description: string;
    author: string;
    tags: string[];
}

export default function SearchIsland() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    
    // Store fuse instance and data
    const fuseRef = useRef<Fuse<SearchResult> | null>(null);

    // Fetch search index on component mount
    useEffect(() => {
        const fetchSearchIndex = async () => {
            try {
                const response = await fetch('/api/search.json');
                const data = await response.json();
                
                // Configure Fuse.js
                fuseRef.current = new Fuse(data, {
                    keys: ['title', 'description', 'tags', 'body'],
                    threshold: 0.3, // Lower threshold = more strict matching
                    includeScore: true
                });
            } catch (error) {
                console.error("Failed to load search index:", error);
            }
        };

        fetchSearchIndex();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query || !fuseRef.current) return;
        
        setIsSearching(true);
        setHasSearched(false);
        setResults([]);
        
        // Simulate a slight delay for the "processing" effect
        setTimeout(() => {
            const searchResults = fuseRef.current!.search(query);
            setResults(searchResults.map(result => result.item));
            setIsSearching(false);
            setHasSearched(true);
        }, 800);
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-10 relative group z-20">
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-lg blur opacity-20 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 pointer-events-none"></div>
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
                    className="px-6 py-2 bg-neon-cyan/5 text-neon-cyan font-display uppercase tracking-widest text-xs border border-neon-cyan/30 rounded hover:bg-neon-cyan hover:text-black hover:shadow-[0_0_15px_rgba(0,240,255,0.6)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSearching || !fuseRef.current}
                >
                    {isSearching ? 'Processing...' : 'Search'}
                </button>
            </form>
            
            {/* Holographic Processing Overlay */}
            {isSearching && (
                <div className="absolute top-16 left-0 right-0 bg-black/90 border border-neon-cyan/30 rounded p-4 text-center font-mono text-sm text-neon-cyan animate-pulse shadow-[0_4px_30px_rgba(0,240,255,0.15)] flex items-center justify-center gap-3">
                    <span className="inline-block w-4 h-4 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin"></span>
                    Consulting local indexes for '<span className="text-white">{query}</span>'...
                </div>
            )}

            {/* Results Display */}
            {hasSearched && !isSearching && (
                <div className="absolute top-20 left-0 right-0 bg-black/95 border border-white/10 rounded overflow-hidden shadow-[0_10px_40px_rgba(0,240,255,0.1)]">
                    {results.length > 0 ? (
                        <div className="max-h-96 overflow-y-auto p-2">
                            <div className="px-4 py-2 border-b border-white/5 mb-2">
                                <span className="text-xs font-display text-gray-500 uppercase tracking-widest">Found {results.length} Artifacts</span>
                            </div>
                            {results.map((result, idx) => (
                                <div key={idx} className="p-4 hover:bg-white/5 border border-transparent hover:border-neon-cyan/30 rounded transition-colors group/item mb-2 last:mb-0 cursor-pointer">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-display text-lg text-[#e0e0e0] group-hover/item:text-neon-cyan transition-colors">{result.title}</h4>
                                        <span className="text-xs bg-white/5 text-gray-400 px-2 py-1 rounded">{result.author}</span>
                                    </div>
                                    <p className="text-sm font-body text-gray-400 mb-3">{result.description}</p>
                                    <div className="flex gap-2">
                                        {result.tags.map(tag => (
                                            <span key={tag} className="text-[10px] font-mono text-neon-purple bg-neon-purple/10 px-1.5 py-0.5 rounded border border-neon-purple/20">#{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500 font-mono text-sm flex flex-col items-center gap-2">
                            <span className="text-2xl opacity-50 block mb-2">∅</span>
                            No records found matching your query in the current databanks.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

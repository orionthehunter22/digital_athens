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
    
    // Refs for fuse and clickaway logic
    const fuseRef = useRef<Fuse<SearchResult> | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchSearchIndex = async () => {
            try {
                const response = await fetch('/api/search.json');
                const data = await response.json();
                
                fuseRef.current = new Fuse(data, {
                    keys: ['title', 'description', 'tags', 'body'],
                    threshold: 0.3,
                    includeScore: true
                });
            } catch (error) {
                console.error("Failed to load search index:", error);
            }
        };

        fetchSearchIndex();
    }, []);

    // Handle Clickaway
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                // If they click outside the search box and results, close the dropdown
                setHasSearched(false);
                setIsSearching(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query || !fuseRef.current) return;
        
        setIsSearching(true);
        setHasSearched(false);
        setResults([]);
        
        setTimeout(() => {
            const searchResults = fuseRef.current!.search(query);
            setResults(searchResults.map(result => result.item));
            setIsSearching(false);
            setHasSearched(true);
        }, 600);
    };

    const handleClear = () => {
        setQuery('');
        setHasSearched(false);
        setResults([]);
    };

    return (
        <div ref={containerRef} className="w-full max-w-2xl mx-auto mb-10 relative group z-50">
            {/* Glowing Backdrop for Search Bar */}
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-lg blur opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 pointer-events-none"></div>
            
            <form onSubmit={handleSearch} className="relative flex items-center bg-black/90 rounded-lg p-2 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
                <span className="pl-4 text-neon-cyan opacity-80 text-xl font-bold animate-pulse">⌘</span>
                <input 
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (e.target.value === '') setHasSearched(false);
                    }}
                    placeholder="Query the Oracle..."
                    className="w-full bg-transparent border-none text-[#e0e0e0] font-body px-4 py-3 focus:outline-none placeholder-gray-600 selection:bg-neon-purple/50 text-lg"
                />
                
                {query && (
                    <button 
                        type="button"
                        onClick={handleClear}
                        className="px-3 text-gray-500 hover:text-neon-purple transition-colors font-mono text-sm mr-2"
                        title="Clear Search"
                    >
                        [✕]
                    </button>
                )}

                <button 
                    type="submit" 
                    className="px-6 py-3 bg-neon-cyan/10 text-neon-cyan font-display uppercase tracking-widest text-xs border border-neon-cyan/40 rounded hover:bg-neon-cyan hover:text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.8)] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={isSearching || !fuseRef.current}
                >
                    {isSearching ? 'Processing...' : 'Search'}
                </button>
            </form>
            
            {/* Holographic Processing Overlay */}
            {isSearching && (
                <div className="absolute top-20 left-0 right-0 bg-black/95 border border-neon-cyan/40 rounded-lg p-6 text-center font-mono text-sm text-neon-cyan animate-pulse shadow-[0_10px_50px_rgba(0,240,255,0.2)] flex flex-col items-center justify-center gap-4 backdrop-blur-xl">
                    <span className="inline-block w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin"></span>
                    <span>Consulting local indexes for '<span className="text-white bg-white/10 px-2 py-1 rounded">{query}</span>'...</span>
                </div>
            )}

            {/* Results Display */}
            {hasSearched && !isSearching && (
                <div className="absolute top-20 left-0 right-0 bg-black/95 border border-white/20 rounded-lg overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
                    {/* Header bar of results */}
                    <div className="px-5 py-3 border-b border-white/10 bg-white/5 flex justify-between items-center">
                        <span className="text-xs font-display text-gray-400 uppercase tracking-widest">
                            Found <span className="text-neon-cyan font-bold">{results.length}</span> Artifacts
                        </span>
                        <button onClick={handleClear} className="text-xs text-gray-500 hover:text-white uppercase font-display tracking-widest transition-colors">Close</button>
                    </div>

                    {results.length > 0 ? (
                        <div className="max-h-[400px] overflow-y-auto p-3 custom-scrollbar">
                            {results.map((result, idx) => (
                                <a 
                                    href={`/research/${result.slug}`} 
                                    key={idx} 
                                    className="block p-5 hover:bg-white/5 border border-transparent hover:border-neon-cyan/30 rounded-lg transition-all duration-300 group/item mb-3 last:mb-0 hover:shadow-[0_0_15px_rgba(0,240,255,0.05)] hover:-translate-y-0.5"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-display text-lg text-[#e0e0e0] group-hover/item:text-neon-cyan transition-colors duration-300">{result.title}</h4>
                                        <span className="text-xs bg-white/5 border border-white/10 text-gray-400 px-2 py-1 rounded ml-4 whitespace-nowrap">{result.author}</span>
                                    </div>
                                    <p className="text-sm font-body text-gray-400 mb-4 line-clamp-2">{result.description}</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {result.tags.map(tag => (
                                            <span key={tag} className="text-[10px] font-mono text-neon-purple bg-neon-purple/10 px-2 py-1 rounded border border-neon-purple/20">#{tag}</span>
                                        ))}
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-gray-500 font-mono text-sm flex flex-col items-center gap-4 bg-gradient-to-b from-transparent to-red-900/10">
                            <span className="text-4xl opacity-50 block mb-2 text-red-500/50">∅</span>
                            <p>No records found matching <span className="text-white px-2">"{query}"</span></p>
                            <p className="text-xs opacity-50">Try adjusting your query parameters.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

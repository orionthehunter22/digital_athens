import React, { useState } from 'react';

// Mock data for the gallery
const artworks = [
    {
        id: 'cyber-athena',
        title: 'Cyber-Athena',
        model: 'Midjourney v6',
        theme: 'Neon Marble Series',
        thumbnail: '🎨',
        fullImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
        color: 'cyan'
    },
    {
        id: 'digital-oracle',
        title: 'The Digital Oracle',
        model: 'Stable Diffusion XL',
        theme: 'Holographic Prophets',
        thumbnail: '👁️',
        fullImage: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2674&auto=format&fit=crop',
        color: 'purple'
    },
    {
        id: 'silicon-acropolis',
        title: 'Silicon Acropolis',
        model: 'DALL-E 3',
        theme: 'Future Topography',
        thumbnail: '🏛️',
        fullImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop',
        color: 'cyan'
    }
];

const ParthenonGallery: React.FC = () => {
    const [selectedArt, setSelectedArt] = useState<typeof artworks[0] | null>(null);

    return (
        <>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {artworks.map((art) => (
                    <div 
                        key={art.id}
                        onClick={() => setSelectedArt(art)}
                        className={`relative group aspect-square overflow-hidden border border-white/10 rounded-xl cursor-pointer hover:border-neon-${art.color}/50 hover:shadow-[0_0_30px_rgba(${art.color === 'cyan' ? '0,240,255' : '157,0,255'},0.15)] transition-all duration-500 hover:-translate-y-1`}
                    >
                        {/* Interactive abstract background replacing actual images for the thumbnail view */}
                        <div className={`absolute inset-0 bg-gradient-to-br from-neon-${art.color}/20 to-transparent mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-500`}></div>
                        <div className="w-full h-full bg-[#0a0a0a]/80 backdrop-blur-xl flex flex-col items-center justify-center relative">
                            {/* Tech grid background */}
                            <div className={`absolute inset-0 bg-[linear-gradient(rgba(${art.color === 'cyan' ? '0,240,255' : '157,0,255'},0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(${art.color === 'cyan' ? '0,240,255' : '157,0,255'},0.03)_1px,transparent_1px)] bg-[size:20px_20px]`}></div>
                            
                            <span className="text-6xl z-20 opacity-40 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700 drop-shadow-lg">
                                {art.thumbnail}
                            </span>
                            
                            {/* Hover info overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex items-center justify-center backdrop-blur-sm">
                                <span className={`font-display text-sm tracking-[0.2em] font-bold text-neon-${art.color} uppercase border border-neon-${art.color}/30 px-6 py-2 rounded-full`}>
                                    Expand
                                </span>
                            </div>
                        </div>
                        
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform duration-500 z-30">
                            <h3 className={`font-display text-xl font-bold text-[#e0e0e0] group-hover:text-neon-${art.color} uppercase tracking-widest mb-1 transition-colors duration-300`}>
                                {art.title}
                            </h3>
                            <p className="text-xs text-gray-400 font-body uppercase tracking-wider">{art.model} <span className="mx-2 opacity-30">•</span> {art.theme}</p>
                        </div>
                    </div>
                ))}
                
                <div className="relative group aspect-square overflow-hidden border border-white/5 rounded-xl border-dashed border-neon-cyan/30 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm cursor-crosshair hover:bg-black/60 transition-colors duration-500">
                    <span className="text-4xl mb-6 opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">➕</span>
                    <p className="font-display text-xs tracking-[0.3em] font-bold text-gray-600 group-hover:text-neon-cyan transition-colors duration-500 uppercase">Awaiting Artifacts</p>
                </div>
            </section>

            {/* Modal Lightbox */}
            {selectedArt && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12"
                    onClick={() => setSelectedArt(null)}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300"></div>
                    
                    {/* Modal Content */}
                    <div 
                        className={`relative z-10 w-full max-w-5xl bg-[#050505] border border-neon-${selectedArt.color}/30 rounded-lg overflow-hidden shadow-[0_0_50px_rgba(${selectedArt.color === 'cyan' ? '0,240,255' : '157,0,255'},0.15)] animate-in zoom-in-95 duration-300`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            onClick={() => setSelectedArt(null)}
                            className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/10 hover:border-white/30 transition-all backdrop-blur-md"
                        >
                            ✕
                        </button>
                        
                        <div className="aspect-video relative overflow-hidden bg-black flex items-center justify-center">
                            {/* We use an unspash placeholder that matches the vibe for the demo */}
                            <img 
                                src={selectedArt.fullImage} 
                                alt={selectedArt.title}
                                className="w-full h-full object-cover opacity-80 mix-blend-screen"
                            />
                            {/* Overlay gradient to blend it into the Cyber-Grecian theme */}
                            <div className={`absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90`}></div>
                            <div className={`absolute inset-0 bg-neon-${selectedArt.color}/10 mix-blend-overlay`}></div>
                        </div>
                        
                        <div className="p-8 border-t border-white/10">
                            <div className="flex justify-between items-end gap-4">
                                <div>
                                    <h2 className={`font-display text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-neon-${selectedArt.color} uppercase tracking-widest mb-2`}>
                                        {selectedArt.title}
                                    </h2>
                                    <p className="font-body text-gray-400 text-lg">
                                        Generative Schema // <span className="text-white">{selectedArt.model}</span>
                                    </p>
                                </div>
                                <div className={`text-right font-mono text-xs text-neon-${selectedArt.color} uppercase tracking-widest bg-neon-${selectedArt.color}/10 px-4 py-2 rounded border border-neon-${selectedArt.color}/20`}>
                                    Collection: {selectedArt.theme}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ParthenonGallery;

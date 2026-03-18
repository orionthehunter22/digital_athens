import React, { useState, useEffect, useRef } from 'react';

type Artwork = {
    id: string;
    title: string;
    model: string;
    theme: string;
    thumbnail: string;
    fullImage: string;
    color: string;
};

const ParthenonGallery: React.FC = () => {
    const [selectedArt, setSelectedArt] = useState<Artwork | null>(null);
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Upload Modal State
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadData, setUploadData] = useState({
        title: '',
        model: 'Custom Upload',
        theme: 'User Artifacts',
        color: 'cyan'
    });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        // Fetch the gallery data on mount
        fetch('/src/data/gallery.json')
            .then(res => res.json())
            .then(data => {
                setArtworks(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to load gallery:", err);
                setIsLoading(false);
            });
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            // Create a preview URL for the selected image
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUploadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('title', uploadData.title);
        formData.append('model', uploadData.model);
        formData.append('theme', uploadData.theme);
        formData.append('color', uploadData.color);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                // Add the new artwork to the top of our local state
                setArtworks([result.artwork, ...artworks]);
                // Reset form
                setShowUploadModal(false);
                setPreviewUrl(null);
                setSelectedFile(null);
                setUploadData({ title: '', model: 'Custom Upload', theme: 'User Artifacts', color: 'cyan' });
            } else {
                console.error("Upload failed");
            }
        } catch (error) {
            console.error("Error during upload:", error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative min-h-[400px]">
                {isLoading ? (
                     <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-neon-cyan animate-pulse tracking-widest uppercase font-mono text-sm">Loading Neural Archives...</span>
                     </div>
                ) : (
                    <>
                        {artworks.map((art) => {
                            const isCyan = art.color === 'cyan';
                            return (
                                <div 
                                    key={art.id}
                                    onClick={() => setSelectedArt(art)}
                                    className={`relative group aspect-square overflow-hidden border border-white/10 rounded-xl cursor-pointer transition-all duration-500 hover:-translate-y-1 ${isCyan ? 'hover:border-neon-cyan/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)]' : 'hover:border-neon-purple/50 hover:shadow-[0_0_30px_rgba(157,0,255,0.15)]'}`}
                                >
                                    {/* Thumbnail Background */}
                                    <div className={`absolute inset-0 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-500 ${isCyan ? 'bg-gradient-to-br from-neon-cyan/20 to-transparent' : 'bg-gradient-to-br from-neon-purple/20 to-transparent'}`}></div>
                                    <div className="w-full h-full bg-[#0a0a0a]/80 backdrop-blur-xl flex flex-col items-center justify-center relative">
                                        {/* Tech grid background */}
                                        <div className={`absolute inset-0 bg-[size:20px_20px] ${isCyan ? 'bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(157,0,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(157,0,255,0.03)_1px,transparent_1px)]'}`}></div>
                                        
                                        <img 
                                            src={art.fullImage}
                                            className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700 mix-blend-screen"
                                            alt={art.title}
                                        />
                                        
                                        <span className="text-6xl z-20 opacity-40 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700 drop-shadow-lg relative">
                                            {art.thumbnail}
                                        </span>
                                        
                                        {/* Hover info overlay */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex items-center justify-center backdrop-blur-sm">
                                            <span className={`font-display text-sm tracking-[0.2em] font-bold uppercase px-6 py-2 rounded-full ${isCyan ? 'text-neon-cyan border border-neon-cyan/30' : 'text-neon-purple border border-neon-purple/30'}`}>
                                                Expand
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform duration-500 z-30">
                                        <h3 className={`font-display text-xl font-bold uppercase tracking-widest mb-1 transition-colors duration-300 text-[#e0e0e0] ${isCyan ? 'group-hover:text-neon-cyan' : 'group-hover:text-neon-purple'}`}>
                                            {art.title}
                                        </h3>
                                        <p className="text-xs text-gray-400 font-body uppercase tracking-wider">{art.model} <span className="mx-2 opacity-30">•</span> {art.theme}</p>
                                    </div>
                                </div>
                            );
                        })}
                        
                        {/* The Upload Card Trigger */}
                        <div 
                            onClick={() => setShowUploadModal(true)}
                            className="relative group aspect-square overflow-hidden border border-white/5 rounded-xl border-dashed border-neon-cyan/30 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm cursor-crosshair hover:bg-black/60 hover:border-neon-cyan/80 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)] transition-all duration-500"
                        >
                            <span className="text-4xl mb-6 opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110">➕</span>
                            <p className="font-display text-xs tracking-[0.3em] font-bold text-gray-600 group-hover:text-neon-cyan transition-colors duration-500 uppercase">Awaiting Artifacts</p>
                            <div className="absolute inset-0 bg-gradient-to-t from-neon-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay pointer-events-none"></div>
                        </div>
                    </>
                )}
            </section>

            {/* View Lightbox Modal */}
            {selectedArt && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12"
                    onClick={() => setSelectedArt(null)}
                >
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300"></div>
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
                            <img 
                                src={selectedArt.fullImage} 
                                alt={selectedArt.title}
                                className="w-full h-full object-cover mix-blend-screen"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-50 pointer-events-none`}></div>
                            <div className={`absolute inset-0 bg-neon-${selectedArt.color}/5 mix-blend-overlay pointer-events-none`}></div>
                        </div>
                        
                        <div className="p-8 border-t border-white/10 relative overflow-hidden">
                             {/* Abstract tech grid inside the metadata panel */}
                             <div className={`absolute inset-0 bg-[size:10px_10px] bg-[linear-gradient(rgba(${selectedArt.color === 'cyan' ? '0,240,255' : '157,0,255'},0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(${selectedArt.color === 'cyan' ? '0,240,255' : '157,0,255'},0.02)_1px,transparent_1px)] z-0`}></div>
                            <div className="flex justify-between items-end gap-4 relative z-10">
                                <div>
                                    <h2 className={`font-display text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-neon-${selectedArt.color} uppercase tracking-widest mb-2`}>
                                        {selectedArt.title}
                                    </h2>
                                    <p className="font-body text-gray-400 text-lg">
                                        Generative Schema // <span className="text-white">{selectedArt.model}</span>
                                    </p>
                                </div>
                                <div className={`text-right font-mono text-xs text-neon-${selectedArt.color} uppercase tracking-widest bg-neon-${selectedArt.color}/5 px-4 py-2 rounded border border-neon-${selectedArt.color}/20 backdrop-blur-sm`}>
                                    Collection: {selectedArt.theme}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Modal Content */}
             {showUploadModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                     <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in" onClick={() => setShowUploadModal(false)}></div>
                     
                     <div className="relative z-10 w-full max-w-xl bg-[#0a0a0a] border border-neon-cyan/30 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,240,255,0.1)] animate-in zoom-in-95 font-body">
                        <div className="border-b border-white/10 p-6 bg-white/5 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 to-transparent pointer-events-none"></div>
                            <h2 className="font-display text-2xl font-black text-white uppercase tracking-widest relative z-10 drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]">Inject Artifact</h2>
                            <button onClick={() => setShowUploadModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-20">✕</button>
                        </div>
                        
                        <form onSubmit={handleUploadSubmit} className="p-6 space-y-6">
                            {/* File Upload Area */}
                            <div 
                                className={`border-2 border-dashed ${previewUrl ? 'border-neon-cyan/50' : 'border-white/20'} rounded-lg p-8 text-center bg-black/40 hover:bg-black/60 transition-colors cursor-pointer relative overflow-hidden group`}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileSelect} 
                                    accept="image/*" 
                                    className="hidden" 
                                    required
                                />
                                
                                {previewUrl ? (
                                    <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-20 transition-opacity">
                                        <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                        <div className="absolute inset-0 bg-black/50 mix-blend-overlay"></div>
                                    </div>
                                ) : null}

                                <div className="relative z-10 flex flex-col items-center">
                                    <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">💾</span>
                                    <p className="text-gray-300 font-bold mb-1 tracking-wider uppercase">Select Media File</p>
                                    <p className="text-xs text-gray-500 font-mono">{selectedFile ? selectedFile.name : 'JPG, PNG, WEBP'}</p>
                                </div>
                            </div>

                            {/* Metadata Fields */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-mono text-neon-cyan uppercase tracking-widest mb-2">Artifact Designation (Title)</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={uploadData.title}
                                        onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                                        className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/30 transition-all font-display tracking-wider"
                                        placeholder="E.g. The Cyber Oracle"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Generative Engine</label>
                                        <input 
                                            type="text" 
                                            required
                                            value={uploadData.model}
                                            onChange={(e) => setUploadData({...uploadData, model: e.target.value})}
                                            className="w-full bg-black/50 border border-white/10 rounded px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-white/30 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Collection Theme</label>
                                        <input 
                                            type="text" 
                                            required
                                            value={uploadData.theme}
                                            onChange={(e) => setUploadData({...uploadData, theme: e.target.value})}
                                            className="w-full bg-black/50 border border-white/10 rounded px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-white/30 transition-all"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Aesthetic Aura</label>
                                    <div className="flex gap-4">
                                        <button 
                                            type="button"
                                            onClick={() => setUploadData({...uploadData, color: 'cyan'})}
                                            className={`flex-1 py-2 rounded border transition-all uppercase tracking-widest text-xs font-bold ${uploadData.color === 'cyan' ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.2)]' : 'border-white/10 text-gray-500 hover:border-white/30'}`}
                                        >
                                            Cyan Core
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setUploadData({...uploadData, color: 'purple'})}
                                            className={`flex-1 py-2 rounded border transition-all uppercase tracking-widest text-xs font-bold ${uploadData.color === 'purple' ? 'border-neon-purple bg-neon-purple/10 text-neon-purple shadow-[0_0_10px_rgba(157,0,255,0.2)]' : 'border-white/10 text-gray-500 hover:border-white/30'}`}
                                        >
                                            Void Purple
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={isUploading || !selectedFile}
                                className={`w-full py-4 rounded font-display font-black uppercase tracking-[0.3em] text-sm transition-all relative overflow-hidden group ${isUploading || !selectedFile ? 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed' : 'bg-neon-cyan text-black hover:bg-white hover:shadow-[0_0_30px_rgba(0,240,255,0.6)]'}`}
                            >
                                {isUploading ? 'Initializing Transfer...' : 'Upload Sequence'}
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            </button>
                        </form>
                     </div>
                 </div>
             )}
        </>
    );
};

export default ParthenonGallery;

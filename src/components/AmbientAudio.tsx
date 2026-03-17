import React, { useState, useRef, useEffect } from 'react';

const AmbientAudio: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const masterGainRef = useRef<GainNode | null>(null);
    const audioElementRef = useRef<HTMLAudioElement | null>(null);
    const isInitialized = useRef(false);

    useEffect(() => {
        // Create the audio element but don't play it yet
        const audioEl = new Audio('/ambient.ogg');
        audioEl.loop = true;
        audioEl.crossOrigin = "anonymous"; // Needed for Web Audio API routing
        audioElementRef.current = audioEl;

        return () => {
            if (audioEl) {
                audioEl.pause();
                audioEl.src = '';
            }
            if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
                audioCtxRef.current.close().catch(() => {});
            }
        };
    }, []);

    const initAudio = () => {
        if (isInitialized.current || !audioElementRef.current) return;
        isInitialized.current = true;
        
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Route the HTML audio element through the AudioContext for smooth fades
        const source = ctx.createMediaElementSource(audioElementRef.current);
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0; // Start completely silent
        
        source.connect(masterGain);
        masterGain.connect(ctx.destination);
        masterGainRef.current = masterGain;
    };

    const toggleAudio = async () => {
        if (!isInitialized.current) {
            initAudio();
        }

        const ctx = audioCtxRef.current!;
        const masterGain = masterGainRef.current!;
        const audioEl = audioElementRef.current!;

        if (isPlaying) {
            // Fade out smoothly over 1.5 seconds
            masterGain.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
            setIsPlaying(false);
            
            // Wait for fade out then pause the actual element to save resources
            setTimeout(() => {
                audioEl.pause();
            }, 1500);

        } else {
            // Ensure audio context is ready
            if (ctx.state === 'suspended') {
                await ctx.resume();
            }
            
            // Start playback
            audioEl.play().catch(e => console.error("Audio playback failed:", e));
            
            // Fade in smoothly over 2 seconds
            masterGain.gain.setTargetAtTime(0.6, ctx.currentTime, 0.8); // 0.6 is max volume
            setIsPlaying(true);
        }
    };

    return (
        <button 
            onClick={toggleAudio}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full border border-neon-cyan/30 bg-[#0a0a0a]/80 backdrop-blur-xl hover:border-neon-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-500 group cursor-pointer"
            aria-label="Toggle Ambient Audio"
            title="Toggle Ambient Audio"
        >
            <span className={`text-xl transition-all duration-500 ${isPlaying ? 'text-neon-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]' : 'text-gray-500 grayscale group-hover:grayscale-0 group-hover:text-neon-cyan'}`}>
                {isPlaying ? '🔊' : '🔇'}
            </span>
            
            {/* Pulsing ring when playing */}
            {isPlaying && (
                <span className="absolute inset-0 rounded-full border border-neon-cyan/50 animate-ping opacity-20 pointer-events-none"></span>
            )}
        </button>
    );
};

export default AmbientAudio;

import React, { useState, useRef } from 'react';

const AmbientAudio: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const masterGainRef = useRef<GainNode | null>(null);
    const isInitialized = useRef(false);

    const initAudio = () => {
        if (isInitialized.current) return;
        isInitialized.current = true;
        
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Master Gain
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0; // Start completely silent
        masterGain.connect(ctx.destination);
        masterGainRef.current = masterGain;

        // --- Cyber-Grecian Drone Generative Synthesis ---
        
        // 1. Deep Sub Bass (Sine) - Foundation
        const subOsc = ctx.createOscillator();
        subOsc.type = 'sine';
        subOsc.frequency.value = 55.0; // Low A
        
        const subGain = ctx.createGain();
        subGain.gain.value = 0.4;
        subOsc.connect(subGain);
        subGain.connect(masterGain);

        // 2. Mid Drone (Triangle) - Warmth & Beating
        const midOsc = ctx.createOscillator();
        midOsc.type = 'triangle';
        midOsc.frequency.value = 110.5; // A2 + slight detune for movement
        
        const midGain = ctx.createGain();
        midGain.gain.value = 0.2;
        
        // Lowpass filter for the mid oscillator to sweep it slowly
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 300;
        filter.Q.value = 2; // slight resonance

        // LFO to modulate filter frequency
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.05; // 20 second sweep
        
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 150; // Sweeps filter between 150 and 450Hz
        
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        midOsc.connect(filter);
        filter.connect(midGain);
        midGain.connect(masterGain);

        // 3. High Ethereal Shimmer (Sine) - The "Cyber" feel
        const shimmerOsc = ctx.createOscillator();
        shimmerOsc.type = 'sine';
        shimmerOsc.frequency.value = 440.0; // A4
        
        const shimmerGain = ctx.createGain();
        shimmerGain.gain.value = 0.03; // Very quiet
        
        // Tremolo LFO for shimmer
        const tremoloLfo = ctx.createOscillator();
        tremoloLfo.type = 'sine';
        tremoloLfo.frequency.value = 0.1; // 10 second swell
        
        const tremoloGain = ctx.createGain();
        tremoloGain.gain.value = 0.02; 
        
        tremoloLfo.connect(tremoloGain);
        tremoloGain.connect(shimmerGain.gain);

        shimmerOsc.connect(shimmerGain);
        shimmerGain.connect(masterGain);

        // Start all oscillators
        subOsc.start();
        midOsc.start();
        lfo.start();
        shimmerOsc.start();
        tremoloLfo.start();
    };

    const toggleAudio = () => {
        if (!isInitialized.current) {
            initAudio();
        }

        const ctx = audioCtxRef.current!;
        const masterGain = masterGainRef.current!;

        if (isPlaying) {
            // Fade out smoothly over 2 seconds
            masterGain.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
            setIsPlaying(false);
        } else {
            if (ctx.state === 'suspended') {
                ctx.resume();
            }
            // Fade in smoothly
            masterGain.gain.setTargetAtTime(0.5, ctx.currentTime, 1.0); // max volume ratio 0.5
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

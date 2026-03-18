import React, { useState, useEffect, useRef } from 'react';

// Mock logs to simulate an agent stream
const RUNTIME_LOGS = [
    { time: '14:02:44', type: 'SYSTEM', color: 'cyan', text: 'Agent OpenClaw initialized. Target context loaded.' },
    { time: '14:02:47', type: 'ACTION', color: 'cyan', text: 'Polling for new repository updates...' },
    { time: '14:02:51', type: 'DATA', color: 'gray', text: 'Commit hash 9251e3a detected. Pulling changes.' },
    { time: '14:03:02', type: 'PROCESS', color: 'purple', text: 'Analyzing new React abstractions in /src/components...' },
    { time: '14:03:12', type: 'WORKFLOW', color: 'purple', text: 'Generating Markdown logs for recently executed task: \'Setup Digital Athens\'.' },
    { time: '14:03:15', type: 'SUCCESS', color: 'green', text: 'Log written to /src/content/logs/setup-digital-athens.md' },
    { time: '14:03:45', type: 'SYSTEM', color: 'cyan', text: 'Awaiting next directive loop...' },
    { time: '14:05:12', type: 'CRON', color: 'gray', text: 'Executing scheduled maintenance scan.' },
    { time: '14:05:18', type: 'ACTION', color: 'cyan', text: 'Optimizing local embeddings database (ChromaDB).' },
    { time: '14:05:24', type: 'SUCCESS', color: 'green', text: 'Database compacted. Saved 14MB of memory.' },
    { time: '14:10:00', type: 'SYSTEM', color: 'cyan', text: 'Heartbeat ping. All systems nominal.' }
];

const LiveTerminal: React.FC = () => {
    const [visibleLogs, setVisibleLogs] = useState<typeof RUNTIME_LOGS>([]);
    const [isTyping, setIsTyping] = useState(true);
    const terminalEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of terminal
    const scrollToBottom = () => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [visibleLogs]);

    // Simulate streaming the logs in one by one
    useEffect(() => {
        let currentIndex = 0;
        
        const streamNextLog = () => {
            if (currentIndex < RUNTIME_LOGS.length) {
                setVisibleLogs(prev => [...prev, RUNTIME_LOGS[currentIndex]]);
                currentIndex++;
                
                // Random delay between 400ms and 2000ms to simulate real processing time
                const nextDelay = Math.random() * 1600 + 400;
                setTimeout(streamNextLog, nextDelay);
            } else {
                setIsTyping(false);
                // Eventually loop it for effect
                setTimeout(() => {
                    setVisibleLogs([]);
                    setIsTyping(true);
                    currentIndex = 0;
                    setTimeout(streamNextLog, 1000);
                }, 8000);
            }
        };

        // Start stream after initial delay
        const initialDelay = setTimeout(streamNextLog, 1000);
        return () => clearTimeout(initialDelay);
    }, []);

    // Helper for log colors
    const getColorClass = (color: string) => {
        switch(color) {
            case 'cyan': return 'text-neon-cyan';
            case 'purple': return 'text-neon-purple drop-shadow-[0_0_5px_rgba(157,0,255,0.5)] font-bold';
            case 'green': return 'text-green-400 font-bold';
            case 'gray': return 'text-gray-500';
            default: return 'text-gray-300';
        }
    };

    // Glitch effect on render
    const [glitchStyle, setGlitchStyle] = useState({});
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.95) {
                setGlitchStyle({
                    transform: `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`,
                    opacity: 0.8
                });
                setTimeout(() => setGlitchStyle({}), 50);
            }
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="border border-white/10 bg-[#050505] rounded-xl overflow-hidden shadow-[0_0_30px_rgba(157,0,255,0.05)] relative font-mono mt-8 group">
            {/* Tech overlay grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(157,0,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(157,0,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none z-0"></div>

            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10 relative z-10 backdrop-blur-sm">
                <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 cursor-pointer transition-colors"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-400 cursor-pointer transition-colors"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                <span className="ml-4 text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="text-neon-purple">~</span> openclaw-agent-live-feed <span className="text-gray-600 ml-2">v2.4.1</span>
                </span>
                
                <div className="ml-auto flex items-center gap-2 text-[10px] text-neon-cyan uppercase tracking-widest animate-pulse border border-neon-cyan/30 px-2 py-0.5 rounded bg-neon-cyan/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan"></span> LIVE
                </div>
            </div>
            
            {/* Terminal Output Area */}
            <div 
                className="p-6 text-sm space-y-4 relative z-10 h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                style={glitchStyle}
            >
                {visibleLogs.length === 0 && (
                    <div className="text-gray-600 italic">Initializing connection to logic core...</div>
                )}
                
                {visibleLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <span className="text-gray-600 shrink-0">[{log.time}]</span>
                        <span className={`shrink-0 w-24 ${getColorClass(log.color)}`}>[{log.type}]</span>
                        <span className="text-gray-300 break-words">{log.text}</span>
                    </div>
                ))}
                
                {/* Active Command Line */}
                <div className="pt-4 flex items-center gap-3">
                    <span className="text-neon-purple font-bold">root@architect:~#</span>
                    <span className={`w-2 h-5 bg-white/80 inline-block ${isTyping ? 'animate-pulse' : 'animate-bounce'}`}></span>
                </div>
                
                <div ref={terminalEndRef} />
            </div>
            
            {/* Glowing bottom edge */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-neon-purple/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px]"></div>
        </div>
    );
};

export default LiveTerminal;

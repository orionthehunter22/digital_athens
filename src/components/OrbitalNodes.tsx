import React, { useEffect, useRef } from 'react';

const OrbitalNodes: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        
        // Configuration
        const particleCount = 60;
        const connectionDistance = 150;
        const particleBaseSpeed = 0.2;

        interface Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            radius: number;
            color: 'cyan' | 'purple';
        }

        let particles: Particle[] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * particleBaseSpeed,
                    vy: (Math.random() - 0.5) * particleBaseSpeed,
                    radius: Math.random() * 1.5 + 0.5,
                    color: Math.random() > 0.5 ? 'cyan' : 'purple'
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update & draw particles
            particles.forEach((p, i) => {
                // Move
                p.x += p.vx;
                p.y += p.vy;

                // Bounce
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                // Draw Particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color === 'cyan' ? 'rgba(0, 240, 255, 0.5)' : 'rgba(157, 0, 255, 0.5)';
                ctx.fill();

                // Connect
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        const opacity = 1 - (distance / connectionDistance);
                        
                        // Mix colors based on connection
                        if (p.color === p2.color) {
                             ctx.strokeStyle = p.color === 'cyan' 
                                ? `rgba(0, 240, 255, ${opacity * 0.15})`
                                : `rgba(157, 0, 255, ${opacity * 0.15})`;
                        } else {
                            // Link between 
                            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.05})`;
                        }
                       
                        ctx.stroke();
                    }
                }
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        resize();
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[-5] opacity-60"
        />
    );
};

export default OrbitalNodes;

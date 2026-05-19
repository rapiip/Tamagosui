

export function PixelBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden bg-background -z-20 pointer-events-none">
      {/* Stars/Particles layer */}
      <div className="absolute inset-0 opacity-50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-background to-background"></div>
      
      {/* 3D Moving Grid */}
      <div className="absolute bottom-0 left-0 w-full h-[60vh] overflow-hidden">
        <div 
          className="absolute w-[200vw] h-[200vh] left-[-50vw] bottom-[-20vh]"
          style={{
            backgroundImage: `
              linear-gradient(transparent 95%, var(--color-primary) 100%),
              linear-gradient(90deg, transparent 95%, var(--color-primary) 100%)
            `,
            backgroundSize: "50px 50px",
            animation: "gridMove 2s linear infinite",
            opacity: 0.4
          }}
        ></div>
        {/* Horizon fade overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-background via-background/80 to-transparent"></div>
      </div>
      
      {/* Ambient Neon Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
    </div>
  );
}

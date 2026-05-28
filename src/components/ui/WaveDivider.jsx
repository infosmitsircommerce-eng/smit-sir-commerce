export default function WaveDivider({ topColor = '#0f0d2e', bottomColor = '#0f0d2e', flip = false }) {
  return (
    <div className={`relative w-full overflow-hidden leading-none ${flip ? 'rotate-180' : ''}`} style={{ height: '60px', backgroundColor: bottomColor }}>
      <svg
        viewBox="0 0 1440 60"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute bottom-0 w-full h-full"
      >
        <path
          d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
          fill={topColor}
        />
      </svg>
    </div>
  );
}

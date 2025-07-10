

interface ContinentLevelProps {
  width: number;
  height: number;
}

export default function ContinentLevel({ width, height }: ContinentLevelProps) {
  return (
    <div 
      className="continent-level relative w-full h-full overflow-hidden"
      style={{ width, height }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
        {/* Continent outline */}
        <div className="absolute inset-4 opacity-30">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <path
              d="M10,20 Q20,15 30,20 Q40,25 50,20 Q60,15 70,20 Q80,25 90,20 L90,80 Q80,75 70,80 Q60,85 50,80 Q40,75 30,80 Q20,85 10,80 Z"
              fill="none"
              stroke="gray"
              strokeWidth="0.5"
            />
          </svg>
        </div>
        
        {/* Highway network */}
        <div className="absolute inset-0 opacity-40">
          <div className="grid grid-cols-6 grid-rows-4 gap-8 p-8">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="flex justify-center">
                <div className="w-3 h-1 bg-gray-800 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Railway lines */}
        <div className="absolute inset-0 opacity-30">
          <div className="grid grid-cols-8 grid-rows-6 gap-6 p-6">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="flex justify-center">
                <div className="w-2 h-0.5 bg-gray-600 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Airport symbols */}
        <div className="absolute inset-0 opacity-50">
          <div className="grid grid-cols-4 grid-rows-3 gap-16 p-16">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex justify-center">
                <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Foreground elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Major highways */}
        <div className="absolute top-1/3 left-0 right-0 h-2 bg-gray-800 opacity-60"></div>
        <div className="absolute bottom-1/3 left-0 right-0 h-2 bg-gray-800 opacity-60"></div>
        <div className="absolute left-1/3 top-0 bottom-0 w-2 bg-gray-800 opacity-60"></div>
        <div className="absolute right-1/3 top-0 bottom-0 w-2 bg-gray-800 opacity-60"></div>
        
        {/* Highway markings */}
        <div className="absolute top-1/3 left-1/4 right-1/4 h-1 bg-yellow-400 opacity-80"></div>
        <div className="absolute bottom-1/3 left-1/4 right-1/4 h-1 bg-yellow-400 opacity-80"></div>
        <div className="absolute left-1/3 top-1/4 bottom-1/4 w-1 bg-yellow-400 opacity-80"></div>
        <div className="absolute right-1/3 top-1/4 bottom-1/4 w-1 bg-yellow-400 opacity-80"></div>
        
        {/* City markers */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-gray-700 rounded-full opacity-70"></div>
        <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-gray-700 rounded-full opacity-70"></div>
        <div className="absolute bottom-1/4 left-1/4 w-3 h-3 bg-gray-700 rounded-full opacity-70"></div>
        <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-gray-700 rounded-full opacity-70"></div>
      </div>
    </div>
  );
} 
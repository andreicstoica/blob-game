interface NeighborhoodLevelProps {
  width: number;
  height: number;
}

export default function NeighborhoodLevel({ width, height }: NeighborhoodLevelProps) {
  return (
    <div 
      className="neighborhood-level relative w-full h-full overflow-hidden"
      style={{ width, height }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-green-200 to-green-300">
        {/* Houses pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 grid-rows-6 gap-8 p-8">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                {/* House roof */}
                <div className="w-8 h-4 bg-gray-600 transform rotate-45 origin-bottom"></div>
                {/* House body */}
                <div className="w-6 h-6 bg-gray-400 border border-gray-500"></div>
                {/* Door */}
                <div className="w-2 h-3 bg-gray-700 -mt-1"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Garden elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="grid grid-cols-12 grid-rows-8 gap-4 p-4">
            {Array.from({ length: 96 }).map((_, i) => (
              <div key={i} className="flex justify-center">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Foreground elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Street lines */}
        <div className="absolute top-1/4 left-0 right-0 h-1 bg-gray-600 opacity-40"></div>
        <div className="absolute top-3/4 left-0 right-0 h-1 bg-gray-600 opacity-40"></div>
        <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-gray-600 opacity-40"></div>
        <div className="absolute left-3/4 top-0 bottom-0 w-1 bg-gray-600 opacity-40"></div>
        
        {/* Street markings */}
        <div className="absolute top-1/4 left-1/4 right-1/4 h-0.5 bg-yellow-400 opacity-60"></div>
        <div className="absolute top-3/4 left-1/4 right-1/4 h-0.5 bg-yellow-400 opacity-60"></div>
        <div className="absolute left-1/4 top-1/4 bottom-1/4 w-0.5 bg-yellow-400 opacity-60"></div>
        <div className="absolute left-3/4 top-1/4 bottom-1/4 w-0.5 bg-yellow-400 opacity-60"></div>
      </div>
    </div>
  );
} 
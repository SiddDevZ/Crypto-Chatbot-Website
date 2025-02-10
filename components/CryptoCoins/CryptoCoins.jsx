import React from 'react'

const CryptoCoins = ({ coins, text }) => {
  const clipPath = 'polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px)';

  return (
    <div className="w-[50%] sm:w-[50%] min-w-[85vw] sm:min-w-0 relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-[#0C0C0C]"
        style={{ clipPath: clipPath }}
      ></div>
      <div className="relative z-10 h-full flex flex-col">
        <h3 className="text-[#9c9c9c] font-pop text-[0.95rem] md:text-[0.875rem] font-semibold pt-3 pl-7 md:pl-5 mb-3.5 md:mb-2.5">
          {text}
        </h3>
        <div className='flex-1 overflow-y-auto space-y-1 sm:space-y-0'>
          {coins.map((coin, index) => (
            <div 
              key={index} 
              className={`flex justify-between items-center px-4 md:px-3 xl:px-5 py-2 md:py-1.5 2xl:py-3 ${
                index % 2 === 0 ? 'bg-[#0F0F0F]' : 'bg-[#0C0C0C]'
              }`}
            >
              <div className='flex items-center'>
                <img 
                  src={coin.logo} 
                  alt={coin.name} 
                  className="w-5 h-5 md:w-4 md:h-4 rounded-full mr-2 2xl:mr-4 cursor-default object-contain" 
                />
                <div className="flex items-center space-x-2 md:space-x-2 2xl:space-x-4 3xl:space-x-5">
                  <span className="text-[#d1d1d1] font-rm text-sm md:text-sm font-semibold cursor-default">
                    {coin.symbol}
                  </span>
                  <span className="text-[#9c9c9c] uppercase font-inter font-semibold text-[0.8rem] md:text-[0.75rem] cursor-default">
                    {coin.name.slice(0, 5)}{coin.name.length > 5 ? '...' : ''}
                  </span>
                </div>
              </div>
              <div className={`font-mono text-sm md:text-xs cursor-default opacity-85 ${coin.priceChange.startsWith('+') ? 'text-[#93E185]' : 'text-[#FC6756]'}`}>
                {coin.priceChange}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CryptoCoins

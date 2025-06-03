import React from 'react';
import { EffectiveStatusBreakdown } from '../../types/index'; 
import { PlayIcon, PauseIcon, FastForwardIcon } from '../shared/icons'; 

interface ControlsPanelProps {
  currentYear: number;
  dynastyName: string;
  statusBreakdown: EffectiveStatusBreakdown; 
  dynastyTreasury: number;
  onPlay: () => void;
  onPause: () => void;
  onFastForward: () => void; // Changed from onStop
  isPlaying: boolean;
  isFastForwarding: boolean; // Added
  isGameOver: boolean;
  notifications: string[];
  onToggleStatusLedger: () => void;
}

const PaperContainer: React.FC<{children: React.ReactNode, className?: string, rotationClass?: string}> = ({ children, className, rotationClass }) => (
  <div className={`bg-yellow-50 p-3 md:p-4 rounded-md shadow-lg hover:shadow-xl transition-all duration-150 ease-in-out ${rotationClass || ''} ${className || ''}`}>
    {children}
  </div>
);

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  currentYear,
  dynastyName,
  statusBreakdown,
  dynastyTreasury,
  onPlay,
  onPause,
  onFastForward, // Changed
  isPlaying,
  isFastForwarding, // Added
  isGameOver,
  notifications,
  onToggleStatusLedger,
}) => {
  return (
    <div className="p-4 md:p-6 text-center bg-yellow-800 shadow-xl rounded-b-lg"> 
      <PaperContainer rotationClass="transform rotate-[-0.5deg] hover:rotate-0" className="mb-4 md:mb-6 mx-auto max-w-lg bg-stone-100">
        <h2 className="text-3xl md:text-4xl font-bold text-yellow-900 tracking-wide">{dynastyName}</h2>
      </PaperContainer>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 items-start">
        
        <PaperContainer rotationClass="transform rotate-[0.8deg] hover:rotate-0" className="min-w-[220px]">
          <div className="flex flex-col items-center">
            <p className="text-lg text-stone-700 font-sans mb-2">
              Current Year: <span className="font-semibold text-stone-800">{currentYear}</span>
            </p>
            {!isGameOver && (
              <div className="flex space-x-2">
                <button
                  onClick={onPlay}
                  disabled={(isPlaying && !isFastForwarding) || isGameOver}
                  className="bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-400 text-white font-bold p-3 rounded-md text-lg transition-colors shadow-md hover:shadow-lg transform hover:scale-105 font-sans"
                  aria-label="Play"
                >
                  <PlayIcon title="Play" />
                </button>
                <button
                  onClick={onPause}
                  disabled={!isPlaying || isGameOver}
                  className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-stone-400 text-white font-bold p-3 rounded-md text-lg transition-colors shadow-md hover:shadow-lg transform hover:scale-105 font-sans"
                  aria-label="Pause"
                >
                  <PauseIcon title="Pause" />
                </button>
                <button
                  onClick={onFastForward} // Changed
                  disabled={(isPlaying && isFastForwarding) || isGameOver}
                  className="bg-sky-600 hover:bg-sky-700 disabled:bg-stone-400 text-white font-bold p-3 rounded-md text-lg transition-colors shadow-md hover:shadow-lg transform hover:scale-105 font-sans"
                  aria-label="Fast Forward" // Changed
                >
                  <FastForwardIcon title="Fast Forward" /> 
                </button>
              </div>
            )}
          </div>
        </PaperContainer>

        <PaperContainer rotationClass="transform rotate-[-1.2deg] hover:rotate-0" className="min-w-[200px]">
          <div className="flex flex-col items-center">
            <span className="text-sm text-yellow-900 font-sans uppercase tracking-wider mb-1">International Status</span>
            <div className="text-center mb-1">
              <span className="text-2xl font-bold text-yellow-700 font-sans" title="Total Effective International Royal Status">
                {statusBreakdown.totalEffectiveStatus.toFixed(2)}
              </span>
              <span className="text-xs text-stone-600 font-sans block">(Total)</span>
            </div>
            <div className="text-xs text-stone-700 font-sans w-full">
              <div className="flex justify-between"><span>From Royals:</span><span className="font-semibold">{statusBreakdown.baseRoyalStatus.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>From Enhancements:</span><span className="font-semibold">{statusBreakdown.itemStatusBoost.toFixed(2)}</span></div>
            </div>
          </div>
        </PaperContainer>

        <PaperContainer rotationClass="transform rotate-[1.5deg] hover:rotate-0" className="min-w-[180px]">
          <div className="flex flex-col items-center">
            <span className="text-sm text-yellow-900 font-sans uppercase tracking-wider mb-1">Treasury</span>
            <span className="text-2xl font-bold text-yellow-700 font-sans">{dynastyTreasury} <span className="text-base opacity-90">gold</span></span>
          </div>
        </PaperContainer>

        <PaperContainer rotationClass="transform rotate-[-0.3deg] hover:rotate-0" className="min-w-[180px]">
           <button
            onClick={onToggleStatusLedger}
            className="w-full h-full bg-stone-100 hover:bg-stone-200 text-yellow-900 font-semibold py-2 px-4 rounded-md transition-colors text-center text-sm shadow-inner hover:shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-600 font-sans"
            aria-label="Open Status Ledger"
          >
            View Status Ledger
          </button>
        </PaperContainer>
      </div>
      
      {isGameOver && (
        <PaperContainer rotationClass="transform rotate-[0.3deg] hover:rotate-0" className="my-4 p-4 bg-red-100 border-2 border-red-400 max-w-md mx-auto">
            <p className="text-2xl text-red-700 font-bold text-center font-sans" role="alert">GAME OVER</p>
        </PaperContainer>
      )}

      {notifications.length > 0 && (
        <PaperContainer rotationClass="transform rotate-[0.7deg] hover:rotate-0" className="mt-4 p-3 md:p-4 h-32 overflow-y-auto custom-scrollbar text-left border border-stone-400">
          <h4 className="text-sm font-semibold text-yellow-900 mb-1 font-sans">Yearly Events:</h4>
          <ul className="list-disc list-inside text-xs text-stone-700 space-y-1 font-sans">
            {notifications.slice().reverse().map((note, index) => ( 
              <li key={index}>{note}</li>
            ))}
          </ul>
        </PaperContainer>
      )}
    </div>
  );
};
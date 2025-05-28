import React from 'react';

interface ControlsPanelProps {
  currentYear: number;
  dynastyName: string;
  dynastyStatus: number; 
  onAdvanceYear: () => void;
  isGameOver: boolean;
  notifications: string[];
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  currentYear,
  dynastyName,
  dynastyStatus,
  onAdvanceYear,
  isGameOver,
  notifications
}) => {
  return (
    <div className="p-4 bg-[#4A3F6A] rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-amber-400 mb-2">{dynastyName}</h2>
      <p className="text-xl text-slate-200 mb-1">Year: {currentYear}</p>
      <p className="text-md text-purple-200 mb-4">Dynasty Status: <span className="font-semibold text-yellow-300">{dynastyStatus.toFixed(1)}</span></p>
      
      {!isGameOver && (
        <button
          onClick={onAdvanceYear}
          className="w-full bg-amber-500 hover:bg-amber-600 text-purple-900 font-bold py-3 px-4 rounded text-lg transition-colors shadow-md mb-4"
        >
          Advance to Next Year
        </button>
      )}
      {isGameOver && (
        <p className="text-2xl text-red-400 font-bold my-4 p-3 bg-red-800 rounded text-center">GAME OVER</p>
      )}

      {notifications.length > 0 && (
        <div className="mt-4 p-3 bg-[#5F5380] rounded-md max-h-48 overflow-y-auto">
          <h4 className="text-sm font-semibold text-sky-300 mb-1">Yearly Events:</h4>
          <ul className="list-disc list-inside text-xs text-purple-200 space-y-1">
            {notifications.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
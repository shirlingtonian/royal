
import React from 'react';
import { Person, HistoricalStatusData, HistoricalTreasuryData, HistoricalDataPoint } from '../../types/index'; // Added HistoricalDataPoint
import { SVGChart } from '../shared/SVGChart'; // Import the new component

export interface DataPageProps {
  isOpen: boolean;
  onClose: () => void;
  historicalStatus: HistoricalStatusData[];
  historicalTreasury: HistoricalTreasuryData[];
  allPeople: Record<string, Person>;
  dynastyName: string;
}

export const DataPage: React.FC<DataPageProps> = ({
  isOpen,
  onClose,
  historicalStatus,
  historicalTreasury,
  allPeople,
  dynastyName
}) => {
  if (!isOpen) return null;

  const statusByGeneration: Record<number, { sum: number; count: number }> = {};
  Object.values(allPeople).forEach(person => {
    if (person.isRoyalBlood && person.lastName === dynastyName.replace("House of ", "")) {
      if (!statusByGeneration[person.generation]) {
        statusByGeneration[person.generation] = { sum: 0, count: 0 };
      }
      statusByGeneration[person.generation].sum += person.statusPoints;
      statusByGeneration[person.generation].count++;
    }
  });

  // Ensure data passed to SVGChart conforms to HistoricalDataPoint structure (year: number, value: number)
  const avgStatusGenData: HistoricalDataPoint[] = Object.entries(statusByGeneration)
    .map(([gen, dataVal]) => ({
      year: parseInt(gen),
      value: dataVal.count > 0 ? dataVal.sum / dataVal.count : 0,
    }))
    .sort((a, b) => a.year - b.year);

  const statusData: HistoricalDataPoint[] = historicalStatus.map(hs => ({ year: hs.year, value: hs.value }));
  const treasuryData: HistoricalDataPoint[] = historicalTreasury.map(ht => ({ year: ht.year, value: ht.value }));

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="data-page-title"
    >
      <div
        className="bg-stone-50 p-6 rounded-lg shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col text-slate-800"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="data-page-title" className="text-3xl font-bold text-teal-700">
            Dynasty Archives: {dynastyName}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-2xl font-bold"
            aria-label="Close data page"
          >
            &times;
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar pr-2">
          <SVGChart data={statusData} title="International Royal Status Over Time" width={700} height={300} color="#14B8A6" yLabel="Status Points"/>
          <SVGChart data={treasuryData} title="Dynasty Treasury Over Time" width={700} height={300} color="#F59E0B" yLabel="Gold"/>
          <SVGChart data={avgStatusGenData} title="Average Personal Status by Generation" width={700} height={300} color="#6366F1" yLabel="Avg. Status" isBarChart={true}/>
        </div>
         <button
          onClick={onClose}
          className="mt-6 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded transition-colors w-full font-sans"
        >
          Close Archives
        </button>
      </div>
    </div>
  );
};

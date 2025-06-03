
import React from 'react';
import { PurchasableItem } from '../../types/index';

interface DynastyUpgradesPanelProps {
  availableItems: PurchasableItem[];
  ownedItemsCount: Record<string, number>; 
  dynastyTreasury: number;
  onPurchaseItem: (itemId: string) => void; 
}

export const DynastyUpgradesPanel: React.FC<DynastyUpgradesPanelProps> = ({
  availableItems,
  ownedItemsCount,
  dynastyTreasury,
  onPurchaseItem,
}) => {
  return (
    <div className="p-4 h-full bg-white">
      <h3 className="text-xl font-semibold text-teal-700 mb-4 sticky top-0 bg-white py-2 z-10 border-b border-stone-200">
        Dynasty Enhancements
      </h3>
      {availableItems.length === 0 && <p className="text-slate-500 font-sans">No enhancements currently known.</p>}
      <div className="space-y-3">
        {availableItems.map(item => { 
          const currentOwnedCount = ownedItemsCount[item.id] || 0;
          const canAfford = dynastyTreasury >= item.cost;
          return ( 
            <div
              key={item.id}
              className={`p-3 rounded-lg shadow-md ${currentOwnedCount > 0 ? 'bg-emerald-50 border border-emerald-300' : 'bg-stone-50'}`}
            >
              <h4 className={`font-semibold ${currentOwnedCount > 0 ? 'text-emerald-700' : 'text-slate-700'}`}>{item.name}</h4> 
              <p className="text-xs text-slate-500 mb-1 font-sans">{item.description}</p>
              <p className="text-sm text-slate-600 font-sans">
                Status Boost: <span className="font-semibold text-teal-600">+{item.statusBoost.toFixed(2)} each</span>
              </p>
              <p className="text-sm text-slate-600 font-sans">
                Cost: <span className={`font-semibold ${canAfford ? 'text-teal-600' : 'text-red-500'}`}>{item.cost} gold</span>
              </p>
              {currentOwnedCount > 0 && (
                 <p className="text-xs text-emerald-600 font-sans mt-1">Owned: {currentOwnedCount}</p>
              )}
              
              <button
                onClick={() => onPurchaseItem(item.id)}
                disabled={!canAfford}
                className={`mt-2 w-full font-semibold py-1 px-2 rounded text-sm transition-colors font-sans
                            ${canAfford ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                                       : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
                aria-label={`Purchase ${item.name} for ${item.cost} gold`}
              >
                {canAfford ? (currentOwnedCount > 0 ? 'Acquire Another' : 'Acquire Enhancement') : 'Cannot Afford'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

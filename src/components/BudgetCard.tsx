interface BudgetCardProps {
  totalBudget: number;
  totalCommitted: number;
  totalSpent: number;
  available: number;
  percentUtilized: number;
}

export function BudgetCard({ totalBudget, totalCommitted, totalSpent, available, percentUtilized }: BudgetCardProps) {
  const spentPercent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const committedPercent = totalBudget > 0 ? (totalCommitted / totalBudget) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
      <div className="flex flex-col gap-4">
        {/* Budget Header */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] sm:text-xs text-silver uppercase tracking-wide font-semibold">
              Total Budget
            </p>
            <p className="text-2xl sm:text-4xl font-bold text-coal mt-1">
              ${totalBudget.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <span className={`text-sm sm:text-base font-semibold ${available >= 0 ? 'text-holly' : 'text-cranberry'}`}>
              ${available.toLocaleString()} Available
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="h-3 sm:h-4 bg-frost rounded-full overflow-hidden flex">
            {/* Spent portion (green) */}
            <div 
              className="h-full bg-holly transition-all duration-500"
              style={{ width: `${Math.min(spentPercent, 100)}%` }}
            />
            {/* Committed portion (amber) */}
            <div 
              className="h-full bg-amber-400 transition-all duration-500"
              style={{ width: `${Math.min(committedPercent, 100 - spentPercent)}%` }}
            />
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-holly" />
            <span className="text-silver">Spent:</span>
            <span className="font-semibold text-coal">${totalSpent.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="text-silver">Committed:</span>
            <span className="font-semibold text-coal">${totalCommitted.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-silver">{percentUtilized}% allocated</span>
          </div>
        </div>
      </div>
    </div>
  );
}

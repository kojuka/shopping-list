interface BudgetCardProps {
  totalSpent: number;
  totalBudget: number;
  percentUtilized: number;
  remaining: number;
}

export function BudgetCard({ totalSpent, totalBudget, percentUtilized, remaining }: BudgetCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] sm:text-xs text-silver uppercase tracking-wide font-semibold">
              Total Budget
            </p>
            <div className="flex items-baseline gap-1 sm:gap-2 mt-1">
              <span className="text-2xl sm:text-4xl font-bold text-coal">
                ${totalSpent.toFixed(0)}
              </span>
              <span className="text-base sm:text-xl text-silver">
                / ${totalBudget.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm sm:text-base font-semibold text-holly">
              ${remaining.toFixed(0)} Left
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs sm:text-sm text-silver">{percentUtilized}% Utilized</span>
          </div>
          <div className="h-2.5 sm:h-3 bg-frost rounded-full overflow-hidden">
            <div 
              className="h-full bg-holly rounded-full transition-all duration-500"
              style={{ width: `${Math.min(percentUtilized, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

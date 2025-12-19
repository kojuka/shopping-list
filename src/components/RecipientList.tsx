import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

interface Recipient {
  _id: Id<"recipients">;
  name: string;
  budget: number;
  spent: number;
}

interface RecipientListProps {
  recipients: Recipient[];
  selectedId: Id<"recipients"> | null;
  onSelect: (id: Id<"recipients">) => void;
}

export function RecipientList({ recipients, selectedId, onSelect }: RecipientListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBudget, setNewBudget] = useState("");
  
  const createRecipient = useMutation(api.recipients.create);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    
    await createRecipient({
      name: newName.trim(),
      budget: parseFloat(newBudget) || 0,
    });
    
    setNewName("");
    setNewBudget("");
    setShowAddForm(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3 sm:mb-4 px-1">
        <h2 className="text-xs text-silver uppercase tracking-wide font-semibold">Recipients</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-sm text-holly hover:text-holly-light active:text-holly-light transition-colors font-medium"
        >
          {showAddForm ? "Cancel" : "+ Add"}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="mb-4 p-3 bg-frost rounded-xl space-y-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Name (e.g. Mom, Kids)"
            className="w-full px-4 py-3 rounded-xl border border-white focus:border-holly outline-none text-base"
            autoFocus
          />
          <input
            type="number"
            inputMode="decimal"
            value={newBudget}
            onChange={(e) => setNewBudget(e.target.value)}
            placeholder="Budget"
            className="w-full px-4 py-3 rounded-xl border border-white focus:border-holly outline-none text-base"
          />
          <button
            type="submit"
            className="w-full py-3 bg-holly text-white rounded-xl text-base font-medium hover:bg-holly-light active:bg-holly-light transition-colors"
          >
            Add Recipient
          </button>
        </form>
      )}

      <div className="space-y-2">
        {recipients.map((recipient) => {
          const percentSpent = recipient.budget > 0 
            ? Math.min(100, Math.round((recipient.spent / recipient.budget) * 100)) 
            : 0;
          
          return (
            <button
              key={recipient._id}
              onClick={() => onSelect(recipient._id)}
              className={`w-full p-4 rounded-xl text-left transition-all active:scale-[0.98] ${
                selectedId === recipient._id
                  ? "bg-cranberry text-white"
                  : "bg-frost hover:bg-gray-200 active:bg-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className={`font-semibold text-base ${selectedId === recipient._id ? "text-white" : "text-coal"}`}>
                  {recipient.name}
                </p>
                <svg 
                  className={`w-5 h-5 lg:hidden ${selectedId === recipient._id ? "text-white/60" : "text-silver"}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className={`text-sm mt-0.5 ${selectedId === recipient._id ? "text-white/80" : "text-silver"}`}>
                ${recipient.spent.toFixed(0)} / ${recipient.budget.toFixed(0)}
              </p>
              {/* Mini progress bar */}
              <div className={`mt-2 h-1 rounded-full overflow-hidden ${selectedId === recipient._id ? "bg-white/20" : "bg-gray-300"}`}>
                <div 
                  className={`h-full rounded-full transition-all ${selectedId === recipient._id ? "bg-white/60" : "bg-holly"}`}
                  style={{ width: `${percentSpent}%` }}
                />
              </div>
            </button>
          );
        })}

        {recipients.length === 0 && !showAddForm && (
          <div className="text-center py-8">
            <p className="text-silver text-sm mb-3">
              No recipients yet
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-holly text-white rounded-xl text-sm font-medium"
            >
              Add Your First Recipient
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { StatusDropdown } from "./StatusDropdown";

type Status = "idea" | "planned" | "bought" | "shipped" | "wrapped" | "delayed";

interface Recipient {
  _id: Id<"recipients">;
  name: string;
  budget: number;
  committed: number;
  spent: number;
}

interface GiftListProps {
  recipient: Recipient;
  onBack: () => void;
}

export function GiftList({ recipient, onBack }: GiftListProps) {
  const items = useQuery(api.items.listByRecipient, { recipientId: recipient._id });
  const createItem = useMutation(api.items.create);
  const updateItem = useMutation(api.items.update);
  const deleteItem = useMutation(api.items.remove);
  const updateRecipient = useMutation(api.recipients.update);
  const deleteRecipient = useMutation(api.recipients.remove);
  
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetValue, setBudgetValue] = useState(recipient.budget.toString());
  const [newItemId, setNewItemId] = useState<Id<"items"> | null>(null);

  const available = recipient.budget - recipient.committed - recipient.spent;

  const handleAddItem = async () => {
    const id = await createItem({
      recipientId: recipient._id,
      name: "",
      cost: 0,
      status: "idea",
      notes: "",
    });
    setNewItemId(id);
  };

  const handleBudgetSave = async () => {
    await updateRecipient({
      id: recipient._id,
      budget: parseFloat(budgetValue) || 0,
    });
    setEditingBudget(false);
  };

  const handleDeleteRecipient = async () => {
    if (confirm(`Delete ${recipient.name} and all their gifts?`)) {
      await deleteRecipient({ id: recipient._id });
      onBack();
    }
  };

  if (!items) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-holly border-t-transparent mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-frost">
        <div className="flex items-center gap-3 mb-3 lg:hidden">
          <button
            onClick={onBack}
            className="min-h-[44px] min-w-[44px] -ml-2 flex items-center justify-center text-silver hover:text-coal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-display font-bold text-coal">{recipient.name}</h2>
        </div>
        
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-display font-bold text-coal hidden lg:block">{recipient.name}</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-silver uppercase tracking-wide">Budget</span>
            {editingBudget ? (
              <div className="flex items-center gap-1">
                <span className="text-silver">$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={budgetValue}
                  onChange={(e) => setBudgetValue(e.target.value)}
                  className="w-24 px-3 py-2 border border-frost rounded-xl text-right text-base"
                  autoFocus
                  onBlur={handleBudgetSave}
                  onKeyDown={(e) => e.key === "Enter" && handleBudgetSave()}
                />
              </div>
            ) : (
              <button
                onClick={() => {
                  setBudgetValue(recipient.budget.toString());
                  setEditingBudget(true);
                }}
                className="min-h-[44px] px-4 border border-frost rounded-xl hover:bg-frost active:bg-frost transition-colors text-base"
              >
                ${recipient.budget.toFixed(0)}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* List Header */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-frost">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-semibold text-coal truncate">{recipient.name}'s List</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {recipient.committed > 0 && (
                <span className="text-amber-600">
                  ${recipient.committed.toFixed(0)} planned
                </span>
              )}
              {recipient.spent > 0 && (
                <span className="text-holly">
                  ${recipient.spent.toFixed(0)} spent
                </span>
              )}
              <span className={available >= 0 ? "text-silver" : "text-cranberry font-semibold"}>
                ${available.toFixed(0)} left
              </span>
            </div>
          </div>
          <button
            onClick={handleAddItem}
            className="min-h-[44px] px-4 sm:px-5 bg-cranberry hover:bg-cranberry-dark active:bg-cranberry-dark text-white rounded-xl font-medium transition-colors flex items-center gap-2 flex-shrink-0"
          >
            <span className="text-lg">+</span>
            <span className="hidden sm:inline">Add Idea</span>
          </button>
        </div>
      </div>

      {/* Items - Card layout for mobile, table for desktop */}
      <div className="divide-y divide-frost">
        {items.map((item) => (
          <GiftCard
            key={item._id}
            item={item}
            autoEditName={item._id === newItemId}
            onUpdate={(updates) => updateItem({ id: item._id, ...updates })}
            onDelete={() => deleteItem({ id: item._id })}
            onEditingComplete={() => setNewItemId(null)}
          />
        ))}
      </div>

      {items.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-silver mb-4">No items yet</p>
          <button
            onClick={handleAddItem}
            className="px-6 py-3 bg-holly text-white rounded-xl font-medium"
          >
            Add First Idea
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 sm:px-6 py-4 border-t border-frost">
        <button
          onClick={handleDeleteRecipient}
          className="min-h-[44px] text-sm text-silver hover:text-cranberry active:text-cranberry transition-colors"
        >
          Delete {recipient.name}
        </button>
      </div>
    </div>
  );
}

interface GiftCardProps {
  item: {
    _id: Id<"items">;
    name: string;
    cost: number;
    status: Status;
    notes: string;
  };
  autoEditName?: boolean;
  onUpdate: (updates: Partial<{ name: string; cost: number; status: Status; notes: string }>) => void;
  onDelete: () => void;
  onEditingComplete?: () => void;
}

function GiftCard({ item, autoEditName, onUpdate, onDelete, onEditingComplete }: GiftCardProps) {
  const [editingName, setEditingName] = useState(autoEditName ?? false);
  const [editingCost, setEditingCost] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [nameValue, setNameValue] = useState(item.name);
  const [costValue, setCostValue] = useState(item.cost.toString());
  const [notesValue, setNotesValue] = useState(item.notes);

  // Ideas show cost as muted since they don't count toward budget
  const isIdea = item.status === "idea";

  return (
    <div className={`p-4 sm:p-5 ${isIdea ? "bg-purple-50/50" : ""}`}>
      {/* Top row: Name and Delete */}
      <div className="flex items-start justify-between gap-3 mb-3">
        {editingName ? (
          <input
            type="text"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            className="flex-1 px-3 py-2 border border-frost rounded-xl text-base font-medium"
            autoFocus
            placeholder="Gift name..."
            onBlur={() => {
              if (nameValue.trim()) {
                onUpdate({ name: nameValue });
              }
              setEditingName(false);
              onEditingComplete?.();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (nameValue.trim()) {
                  onUpdate({ name: nameValue });
                }
                setEditingName(false);
                onEditingComplete?.();
              }
            }}
          />
        ) : (
          <button
            onClick={() => setEditingName(true)}
            className="text-left font-semibold text-coal text-base hover:text-holly active:text-holly"
          >
            {item.name}
          </button>
        )}
        
        <button
          onClick={onDelete}
          className="min-h-[44px] min-w-[44px] -mr-2 -mt-2 flex items-center justify-center text-silver hover:text-cranberry active:text-cranberry transition-colors"
          title="Delete item"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Middle row: Cost and Status */}
      <div className="flex items-center gap-3 mb-3">
        {editingCost ? (
          <div className="flex items-center gap-1">
            <span className="text-silver">$</span>
            <input
              type="number"
              inputMode="decimal"
              value={costValue}
              onChange={(e) => setCostValue(e.target.value)}
              className="w-24 px-3 py-2 border border-frost rounded-xl text-base"
              autoFocus
              onBlur={() => {
                onUpdate({ cost: parseFloat(costValue) || 0 });
                setEditingCost(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onUpdate({ cost: parseFloat(costValue) || 0 });
                  setEditingCost(false);
                }
              }}
            />
          </div>
        ) : (
          <button
            onClick={() => setEditingCost(true)}
            className={`min-h-[44px] px-4 border border-frost rounded-xl hover:bg-frost active:bg-frost transition-colors font-medium ${isIdea ? "text-silver" : ""}`}
          >
            ${item.cost.toFixed(2)}
            {isIdea && <span className="text-xs ml-1">(est)</span>}
          </button>
        )}
        
        <StatusDropdown
          status={item.status}
          onChange={(status) => onUpdate({ status })}
        />
      </div>

      {/* Bottom row: Notes */}
      {editingNotes ? (
        <input
          type="text"
          value={notesValue}
          onChange={(e) => setNotesValue(e.target.value)}
          className="w-full px-3 py-2 border border-frost rounded-xl text-sm"
          autoFocus
          placeholder="Add notes..."
          onBlur={() => {
            onUpdate({ notes: notesValue });
            setEditingNotes(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onUpdate({ notes: notesValue });
              setEditingNotes(false);
            }
          }}
        />
      ) : (
        <button
          onClick={() => setEditingNotes(true)}
          className="w-full text-left text-sm text-silver hover:text-coal active:text-coal italic py-1"
        >
          {item.notes || "Add notes..."}
        </button>
      )}
    </div>
  );
}

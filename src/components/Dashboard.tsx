import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { Header } from "./Header";
import { BudgetCard } from "./BudgetCard";
import { RecipientList } from "./RecipientList";
import { GiftList } from "./GiftList";

export function Dashboard() {
  const recipients = useQuery(api.recipients.list);
  const globalBudget = useQuery(api.recipients.getGlobalBudget);
  const [selectedRecipientId, setSelectedRecipientId] = useState<Id<"recipients"> | null>(null);
  const [showRecipientList, setShowRecipientList] = useState(true);

  // Auto-select first recipient if none selected
  const selectedRecipient = selectedRecipientId 
    ? recipients?.find(r => r._id === selectedRecipientId)
    : recipients?.[0];

  // On mobile, when a recipient is selected, hide the list
  const handleSelectRecipient = (id: Id<"recipients">) => {
    setSelectedRecipientId(id);
    setShowRecipientList(false);
  };

  if (!recipients || !globalBudget) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-holly border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      <Header remaining={globalBudget.available} />
      
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <BudgetCard
          totalBudget={globalBudget.totalBudget}
          totalCommitted={globalBudget.totalCommitted}
          totalSpent={globalBudget.totalSpent}
          available={globalBudget.available}
          percentUtilized={globalBudget.percentUtilized}
        />

        <div className="mt-4 sm:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Mobile: Show either list or detail */}
          {/* Desktop: Show both side by side */}
          <div className={`lg:col-span-4 ${!showRecipientList ? 'hidden lg:block' : ''}`}>
            <RecipientList
              recipients={recipients}
              selectedId={selectedRecipient?._id ?? null}
              onSelect={handleSelectRecipient}
            />
          </div>
          
          <div className={`lg:col-span-8 ${showRecipientList && recipients.length > 0 ? 'hidden lg:block' : ''}`}>
            {selectedRecipient ? (
              <GiftList 
                recipient={selectedRecipient} 
                onBack={() => setShowRecipientList(true)}
              />
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12 text-center">
                <p className="text-silver">Add a recipient to get started</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

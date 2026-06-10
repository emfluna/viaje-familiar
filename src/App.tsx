/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Friend, TripDay, Expense, TouristPlace } from './types';
import { getSavedState, saveState, INITIAL_FRIENDS, INITIAL_DAYS, INITIAL_EXPENSES } from './data';
import TravelHeader from './components/TravelHeader';
import Sidebar from './components/Sidebar';
import ItineraryPanel from './components/ItineraryPanel';
import ExpensesPanel from './components/ExpensesPanel';
import SettleUpPanel from './components/SettleUpPanel';
import DashboardCharts from './components/DashboardCharts';
import ExpenseModal from './components/ExpenseModal';
import { 
  Compass, 
  Wallet, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  RefreshCw,
  Sparkles,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PALETTE = [
  'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 
  'bg-indigo-505', 'bg-violet-500', 'bg-rose-500', 
  'bg-pink-500', 'bg-amber-500', 'bg-orange-500'
];

export default function App() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [days, setDays] = useState<TripDay[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('u_1');
  const [selectedDayId, setSelectedDayId] = useState<string>('all'); // "all" or specific day ID

  // Active workspace tab for general viewing
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'itinerary' | 'charts'>('itinerary');

  // Modal controls
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Load state on mount
  useEffect(() => {
    const saved = getSavedState();
    setFriends(saved.friends);
    setDays(saved.days);
    setExpenses(saved.expenses);
    setCurrentUserId(saved.currentUserId);
  }, []);

  // Central state update + safe localStorage syncing
  const updateStateAndSave = (
    updatedFriends: Friend[],
    updatedDays: TripDay[],
    updatedExpenses: Expense[],
    updatedUserId: string
  ) => {
    setFriends(updatedFriends);
    setDays(updatedDays);
    setExpenses(updatedExpenses);
    setCurrentUserId(updatedUserId);
    saveState(updatedFriends, updatedDays, updatedExpenses, updatedUserId);
  };

  // Add a brand new sequentially numbered day
  const handleAddDay = (dateString: string) => {
    const nextNumber = days.length + 1;
    const newDay: TripDay = {
      id: `day_${Date.now()}`,
      dayNumber: nextNumber,
      date: dateString,
      touristPlaces: [],
    };
    const nextDays = [...days, newDay];
    updateStateAndSave(friends, nextDays, expenses, currentUserId);
    setSelectedDayId(newDay.id); // Navigate to new day immediately
  };

  // Add friend/partner to the journey
  const handleAddFriend = (name: string, emoji: string) => {
    const avatarColor = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    const newFriend: Friend = {
      id: `u_${Date.now()}`,
      name,
      avatarColor,
      avatarEmoji: emoji,
    };
    const nextFriends = [...friends, newFriend];
    updateStateAndSave(nextFriends, days, expenses, currentUserId);
  };

  // Toggle tourist spot as visited
  const handleToggleVisited = (dayId: string, placeId: string) => {
    const nextDays = days.map((day) => {
      if (day.id === dayId) {
        return {
          ...day,
          touristPlaces: day.touristPlaces.map((place) => {
            if (place.id === placeId) {
              return { ...place, isVisited: !place.isVisited };
            }
            return place;
          }),
        };
      }
      return day;
    });
    updateStateAndSave(friends, nextDays, expenses, currentUserId);
  };

  // Add dynamic tourist point to specific day
  const handleAddPlace = (dayId: string, placeData: Omit<TouristPlace, 'id' | 'isVisited'>) => {
    const newPlace: TouristPlace = {
      id: `place_${Date.now()}`,
      ...placeData,
      isVisited: false,
    };

    const nextDays = days.map((day) => {
      if (day.id === dayId) {
        return {
          ...day,
          touristPlaces: [...day.touristPlaces, newPlace],
        };
      }
      return day;
    });

    updateStateAndSave(friends, nextDays, expenses, currentUserId);
  };

  // Remove planned tourist point
  const handleRemovePlace = (dayId: string, placeId: string) => {
    const nextDays = days.map((day) => {
      if (day.id === dayId) {
        return {
          ...day,
          touristPlaces: day.touristPlaces.filter((p) => p.id !== placeId),
        };
      }
      return day;
    });
    updateStateAndSave(friends, nextDays, expenses, currentUserId);
  };

  // Save new/edited cost item
  const handleSaveExpense = (expenseData: Omit<Expense, 'id'>, id?: string) => {
    if (id) {
      // Edit mode
      const nextExpenses = expenses.map((exp) => {
        if (exp.id === id) {
          return { ...expenseData, id } as Expense;
        }
        return exp;
      });
      updateStateAndSave(friends, days, nextExpenses, currentUserId);
    } else {
      // Creation mode
      const newExpense: Expense = {
        ...expenseData,
        id: `exp_${Date.now()}`,
      } as Expense;
      const nextExpenses = [newExpense, ...expenses];
      updateStateAndSave(friends, days, nextExpenses, currentUserId);
    }
  };

  // Delete cost item with user feedback
  const handleDeleteExpense = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este gasto de viaje?')) {
      const nextExpenses = expenses.filter((e) => e.id !== id);
      updateStateAndSave(friends, days, nextExpenses, currentUserId);
    }
  };

  // Settle up direct repayment
  const handleSettleDebt = (fromId: string, toId: string, amount: number) => {
    const debtorName = friends.find((f) => f.id === fromId)?.name || 'Viajero';
    const creditorName = friends.find((f) => f.id === toId)?.name || 'Viajero';

    const settlementExpense: Expense = {
      id: `settle_${Date.now()}`,
      tripDayId: 'general',
      description: `Saldado: ${debtorName} → ${creditorName} 🤝`,
      amount,
      payerId: fromId,
      category: 'pago',
      splits: [
        { friendId: toId, amount }, // Creditor gains the split credit
      ],
      isSettlement: true,
      notes: `Liquidación directa de cuentas del viaje. ${debtorName} transfirió un total de ${amount.toFixed(2)} € a ${creditorName}.`,
    };

    const nextExpenses = [settlementExpense, ...expenses];
    updateStateAndSave(friends, days, nextExpenses, currentUserId);
  };

  // Wipe states to factory demo data safely
  const handleRestoreDefaults = () => {
    if (window.confirm('Esto borrará los datos actuales y restablecerá el viaje de demostración. ¿Deseas continuar?')) {
      updateStateAndSave(INITIAL_FRIENDS, INITIAL_DAYS, INITIAL_EXPENSES, 'u_1');
      setSelectedDayId('all');
      setActiveWorkspaceTab('itinerary');
    }
  };

  // Currently selected day model (undefined if 'all')
  const activeDayObj = days.find((d) => d.id === selectedDayId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none antialiased">
      {/* Top Travel Header with simulated agent metrics */}
      <TravelHeader
        friends={friends}
        currentUserId={currentUserId}
        onUserChange={setCurrentUserId}
        expenses={expenses}
      />

      {/* Main app panel */}
      <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden">
        
        {/* Sidebar Left: calendar days and friend travelers party */}
        <Sidebar
          days={days}
          friends={friends}
          selectedDayId={selectedDayId}
          onSelectDay={setSelectedDayId}
          onAddDay={handleAddDay}
          onAddFriend={handleAddFriend}
          currentUserId={currentUserId}
        />

        {/* Core Screen Space Dashboard */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 bg-slate-50/50">
          
          {/* Top row: Tab Workspace triggers & general reset button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-3xs">
            <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-100">
              <button
                id="tab-itinerary"
                onClick={() => setActiveWorkspaceTab('itinerary')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  activeWorkspaceTab === 'itinerary'
                    ? 'bg-white text-teal-800 shadow-3xs border border-slate-100'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Compass className="w-4 h-4 text-teal-605" />
                <span>Lugares Turísticos e Itinerario 🗺️</span>
              </button>

              <button
                id="tab-charts"
                onClick={() => setActiveWorkspaceTab('charts')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  activeWorkspaceTab === 'charts'
                    ? 'bg-white text-teal-800 shadow-3xs border border-slate-100'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Estadísticas y Análisis 📈</span>
              </button>
            </div>

            <button
              id="btn-restore-defaults"
              onClick={handleRestoreDefaults}
              className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-rose-500 transition-colors py-1.5 px-3 rounded-xl border border-dashed border-slate-200 hover:border-rose-100 bg-transparent cursor-pointer"
              title="Restaurar viaje demo"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reiniciar Datos Prueba</span>
            </button>
          </div>

          {/* Upper conditional space based on Workspace Tab Selection */}
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence mode="wait">
              {activeWorkspaceTab === 'itinerary' ? (
                <motion.div
                  key="itinerary-view"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                >
                  <ItineraryPanel
                    selectedDay={activeDayObj}
                    onToggleVisited={handleToggleVisited}
                    onAddPlace={handleAddPlace}
                    onRemovePlace={handleRemovePlace}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="charts-view"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                >
                  <DashboardCharts
                    expenses={expenses}
                    friends={friends}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Lower dual visual split columns: Left costs ledger, Right debts settlements direct links */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Split column left: Ledger register (spanning 2 columns on desktop) */}
            <div className="xl:col-span-2">
              <ExpensesPanel
                expenses={expenses}
                friends={friends}
                days={days}
                selectedDayId={selectedDayId}
                currentUserId={currentUserId}
                onAddExpenseClick={() => {
                  setEditingExpense(null);
                  setIsExpenseModalOpen(true);
                }}
                onEditExpense={(exp) => {
                  setEditingExpense(exp);
                  setIsExpenseModalOpen(true);
                }}
                onDeleteExpense={handleDeleteExpense}
              />
            </div>

            {/* Split column right: SettleUp live calculations (spanning 1 column) */}
            <div className="xl:col-span-1">
              <SettleUpPanel
                expenses={expenses}
                friends={friends}
                onSettleDebt={handleSettleDebt}
                currentUserId={currentUserId}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Expense Creator/Editor Modal */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setEditingExpense(null);
        }}
        friends={friends}
        days={days}
        currentUserId={currentUserId}
        onSaveExpense={(data, id) => {
          handleSaveExpense(data, id);
          setIsExpenseModalOpen(false);
          setEditingExpense(null);
        }}
        editingExpense={editingExpense}
        initialDayId={selectedDayId}
      />
    </div>
  );
}

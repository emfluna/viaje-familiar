/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TripDay, Friend, Expense, Currency, CURRENCY_SYMBOLS } from '../types';
import { 
  Calendar, 
  MapPin, 
  Plus, 
  Users, 
  UserPlus, 
  X, 
  ArrowRight,
  Compass,
  Trophy,
  Pencil,
  Trash2,
  Wallet,
  Wifi,
  WifiOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  days: TripDay[];
  friends: Friend[];
  selectedDayId: string; // "all" or specific DayDay ID
  onSelectDay: (id: string) => void;
  onAddDay: (dateString: string) => void;
  onAddFriend: (name: string, emoji: string, color?: string) => void;
  onEditFriend: (id: string, name: string, emoji: string, color?: string) => void;
  onDeleteFriend?: (id: string) => void;
  onUpdateDayDate?: (dayId: string, newDate: string) => void;
  currentUserId: string;
  expenses: Expense[];
  currency: Currency;
  budgetLimit: number;
  onBudgetLimitChange: (limit: number) => void;
  isOffline: boolean;
}

const PALETTE = [
  'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 
  'bg-indigo-500', 'bg-violet-500', 'bg-rose-500', 
  'bg-pink-500', 'bg-amber-500', 'bg-orange-500', 'bg-blue-500'
];

const EMOJIS = ['🦁', '🦊', '🦒', '🐼', '🐨', '🐠', '🐬', '🦄', '🐳', '🦉', '🐱', '🐶'];

export default function Sidebar({
  days,
  friends,
  selectedDayId,
  onSelectDay,
  onAddDay,
  onAddFriend,
  onEditFriend,
  onDeleteFriend,
  onUpdateDayDate,
  currentUserId,
  expenses = [],
  currency = 'BRL',
  budgetLimit = 1200,
  onBudgetLimitChange,
  isOffline = false,
}: SidebarProps) {
  const [showAddDayModal, setShowAddDayModal] = useState(false);
  const [showCompanionModal, setShowCompanionModal] = useState(false);

  // Editing companion state
  const [editingFriend, setEditingFriend] = useState<Friend | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmoji, setEditEmoji] = useState(EMOJIS[0]);
  const [editColor, setEditColor] = useState('bg-teal-500');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // New Day forms states
  const [newDayDate, setNewDayDate] = useState('');

  // Companion form states
  const [companionName, setCompanionName] = useState('');
  const [companionEmoji, setCompanionEmoji] = useState(EMOJIS[0]);
  const [companionColor, setCompanionColor] = useState('bg-teal-500');

  const handleAddDaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDayDate) return;
    onAddDay(newDayDate);
    setNewDayDate('');
    setShowAddDayModal(false);
  };

  const handleAddFriendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companionName.trim()) return;
    onAddFriend(companionName.trim(), companionEmoji, companionColor);
    setCompanionName('');
    setCompanionEmoji(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
    setCompanionColor('bg-teal-500');
    setShowCompanionModal(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <aside className="w-full md:w-80 bg-white border-r border-slate-100 flex flex-col h-[calc(100vh-80px)] shrink-0 shadow-sm">
      
      {/* Big Action Block */}
      <div className="p-4 border-b border-slate-50 space-y-2">
        <button
          id="btn-nav-all"
          onClick={() => onSelectDay('all')}
          className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
            selectedDayId === 'all'
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 font-extrabold shadow-sm'
              : 'text-slate-500 hover:bg-slate-50 border border-transparent'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Compass className="w-4.5 h-4.5 text-emerald-500" />
            <span>Todo el Viaje (Global)</span>
          </div>
          <span className="font-mono text-[10px] bg-slate-100 font-semibold text-slate-500 py-0.5 px-2 rounded-md">
            {days.length} d
          </span>
        </button>
      </div>

      {/* Main List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* BUDGE REGULATOR / GASTOS TOTALES CONTROL CARD */}
        {(() => {
          const nonSettlers = expenses.filter(e => !e.isSettlement);
          const totalCost = nonSettlers.reduce((sum, e) => sum + e.amount, 0);
          const percentage = Math.min(100, Math.round((totalCost / budgetLimit) * 100));
          return (
            <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white rounded-2xl p-4 shadow-sm border border-slate-800 space-y-3 relative overflow-hidden select-none">
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-teal-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-teal-300 shrink-0" />
                  <span>Control de Presupuesto</span>
                </span>
                <span className="text-[10px] font-mono font-bold bg-white/10 px-2 py-0.5 rounded-md text-slate-200">
                  Uso: {percentage}%
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-0.5">
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-extrabold tracking-wide">Gastado</span>
                  <span className="font-mono text-base font-black text-white">
                    {CURRENCY_SYMBOLS[currency]} {totalCost.toFixed(2)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 block uppercase font-extrabold tracking-wide">Límite Máx.</span>
                  <span className="font-mono text-sm font-black text-teal-200">
                    {CURRENCY_SYMBOLS[currency]} {budgetLimit.toFixed(0)}
                  </span>
                </div>
              </div>

              {/* Progress dynamic warning colors */}
              <div className="space-y-1">
                <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      percentage >= 95 
                        ? 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' 
                        : percentage >= 80 
                          ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]' 
                          : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[9px] text-slate-350 font-semibold">
                  <span>0%</span>
                  {percentage >= 95 ? (
                    <span className="text-rose-400 font-black animate-pulse uppercase tracking-wide">⚠️ ¡Presupuesto Excedido!</span>
                  ) : percentage >= 80 ? (
                    <span className="text-amber-400 font-bold uppercase tracking-wide">Advertencia: Límite</span>
                  ) : (
                    <span className="text-emerald-400 font-bold uppercase tracking-wide">Óptimo y Seguro</span>
                  )}
                  <span>100%</span>
                </div>
              </div>

              {/* Direct interactive range adjusting */}
              {onBudgetLimitChange && (
                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Cambiar rango:</span>
                  <div className="flex items-center gap-1.5 bg-black/30 rounded-lg p-0.5 border border-white/5">
                    <button
                      type="button"
                      onClick={() => onBudgetLimitChange(Math.max(100, budgetLimit - 100))}
                      className="w-5 h-5 bg-white/5 hover:bg-white/15 active:scale-90 text-[10px] text-white rounded-md flex items-center justify-center font-black transition-all cursor-pointer border border-transparent"
                      title="Restar 100"
                    >
                      -
                    </button>
                    <span className="font-mono text-[9px] font-bold text-white px-1">
                      {CURRENCY_SYMBOLS[currency]}{budgetLimit}
                    </span>
                    <button
                      type="button"
                      onClick={() => onBudgetLimitChange(budgetLimit + 100)}
                      className="w-5 h-5 bg-white/5 hover:bg-white/15 active:scale-90 text-[10px] text-white rounded-md flex items-center justify-center font-black transition-all cursor-pointer border border-transparent"
                      title="Sumar 100"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* OFFLINE CAPABILITY BLOCK NOTIFIER */}
        {isOffline && (
          <div className="bg-amber-50/55 border border-amber-200/60 rounded-2xl p-3.5 space-y-2 select-none relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-amber-200/20 rounded-full blur-lg" />
            <div className="flex items-start gap-2.5">
              <WifiOff className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[11px] font-extrabold text-amber-850 block">Trabajando sin Conexión 📶</span>
                <p className="text-[10px] leading-relaxed text-slate-500 font-medium">
                  Estás sin conexión a internet. No te preocupes: puedes registrar visitas, agregar gastos, registrar deudas y organizar el itinerario con normalidad. Los cambios se guardarán de forma local en tu navegador con total seguridad.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* DAYS / CALENDAR SECTION */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Días del Itinerario</span>
            </span>
            
            <button
              id="btn-sidebar-add-day"
              onClick={() => {
                // Pre-fill next sequential date
                if (days.length > 0) {
                  const lastDate = new Date(days[days.length - 1].date);
                  lastDate.setDate(lastDate.getDate() + 1);
                  setNewDayDate(lastDate.toISOString().split('T')[0]);
                } else {
                  setNewDayDate(new Date().toISOString().split('T')[0]);
                }
                setShowAddDayModal(true);
              }}
              className="p-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 rounded-lg transition-colors border border-slate-100 cursor-pointer"
              title="Añadir un Día a tu Viaje"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5">
            {days.length === 0 ? (
              <p className="text-xs text-slate-400 px-3 py-4 italic text-center bg-slate-50 rounded-xl border border-dashed border-slate-150">
                Aún no has agregado días o fechas de viaje
              </p>
            ) : (
              days.map((day) => {
                const isActive = selectedDayId === day.id;
                const placeCount = day.touristPlaces.length;
                const visitedCount = day.touristPlaces.filter(p => p.isVisited).length;
                
                return (
                  <button
                    key={day.id}
                    id={`day-nav-${day.id}`}
                    onClick={() => onSelectDay(day.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 border ${
                      isActive
                        ? 'bg-teal-50/50 border-teal-200 text-teal-800 font-semibold shadow-xs translate-x-1.5'
                        : 'text-slate-600 hover:bg-slate-50 border-transparent hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex flex-col items-center justify-center font-display shrink-0 ${
                        isActive ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <span className="text-[10px] font-bold leading-none uppercase">Día</span>
                        <span className="text-sm font-black leading-tight mt-0.5">{day.dayNumber}</span>
                      </div>
                      
                      <div className="text-left truncate">
                        {onUpdateDayDate ? (
                          <div 
                            className="flex items-center gap-1 mt-0.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="date"
                              title="Haz clic para cambiar la fecha de este día"
                              className="text-[10px] font-semibold text-slate-550 bg-slate-50 hover:bg-teal-50 hover:text-teal-700 border border-slate-200/80 rounded-md px-1.5 py-0.5 transition-all cursor-pointer font-sans"
                              value={day.date}
                              onChange={(e) => {
                                if (e.target.value) {
                                  onUpdateDayDate(day.id, e.target.value);
                                }
                              }}
                            />
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium block">
                            {formatDate(day.date)}
                          </span>
                        )}
                        <span className="text-xs font-semibold block truncate mt-1">
                          {placeCount === 0 
                            ? 'Sin lugares turísticos' 
                            : placeCount === 1 
                              ? '1 atracción' 
                              : `${placeCount} atracciones`
                          }
                        </span>
                      </div>
                    </div>

                    {placeCount > 0 && (
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                        visitedCount === placeCount 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {visitedCount}/{placeCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* TRIP MATES / TRAVELERS LIST SECTION */}
        <div className="space-y-3 pt-4 border-t border-slate-55">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Compañeros del Viaje</span>
            </span>
            <button
              id="btn-sidebar-add-friend"
              onClick={() => setShowCompanionModal(true)}
              className="p-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 rounded-lg transition-colors border border-slate-100 cursor-pointer"
              title="Añadir a un amigo al viaje"
            >
              <UserPlus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {friends.map((friend) => {
              const isCurrentUser = friend.id === currentUserId;
              return (
                <div
                  key={friend.id}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-sm border border-slate-105 bg-slate-50/50 hover:bg-slate-55 transition-colors group"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-xs shrink-0 ${friend.avatarColor}`}>
                      {friend.avatarEmoji}
                    </div>
                    <span className="font-semibold text-slate-700 truncate">
                      {friend.name} {isCurrentUser && <span className="text-slate-400 text-xs font-normal italic">(Tú)</span>}
                    </span>
                  </div>

                  <button
                    id={`btn-edit-friend-${friend.id}`}
                    onClick={() => {
                      setEditingFriend(friend);
                      setEditName(friend.name);
                      setEditEmoji(friend.avatarEmoji);
                      setEditColor(friend.avatarColor || 'bg-teal-500');
                      setShowConfirmDelete(false);
                      setDeleteError('');
                    }}
                    className="p-1 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                    title="Editar datos del viajero"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MODAL: ADD TRIP DAY */}
      <AnimatePresence>
        {showAddDayModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden border border-slate-100"
            >
              <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 font-display">
                  <Calendar className="w-5 h-5 text-teal-600" />
                  Agregar Nuevo Día
                </h3>
                <button
                  onClick={() => setShowAddDayModal(false)}
                  className="p-1 px-2.5 hover:bg-slate-250 hover:text-slate-700 text-slate-400 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddDaySubmit}>
                <div className="p-5 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Día número: {days.length + 1}
                    </label>
                    <input
                      type="date"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition-all"
                      value={newDayDate}
                      onChange={(e) => setNewDayDate(e.target.value)}
                      required
                    />
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                      Establecer la fecha calendario de tu siguiente destino. Podrás organizar visitas turísticas exclusivas para este día de viaje.
                    </p>
                  </div>
                </div>

                <div className="p-5 border-t border-slate-50 bg-slate-50 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddDayModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4.5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Crear Día {days.length + 1}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCompanionModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden border border-slate-100"
            >
              <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 font-display">
                  <UserPlus className="w-5 h-5 text-teal-600" />
                  Agregar Compañero
                </h3>
                <button
                  onClick={() => setShowCompanionModal(false)}
                  className="p-1 px-2.5 hover:bg-slate-250 hover:text-slate-700 text-slate-400 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddFriendSubmit}>
                <div className="p-5 space-y-4">
                  <div className="space-y-1.5 border-b border-slate-50 pb-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Nombre de tu amigo</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition-all"
                      placeholder="Ej: Alejandro, Valentina, Sofía..."
                      value={companionName}
                      onChange={(e) => setCompanionName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Logotipo / Emoji de Viaje</label>
                    <div className="grid grid-cols-6 gap-2">
                      {EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setCompanionEmoji(emoji)}
                          className={`w-10 h-10 text-lg rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                            companionEmoji === emoji 
                              ? 'bg-teal-50 border-teal-500 scale-105' 
                              : 'bg-white border-slate-150 hover:bg-slate-50'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color selector */}
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Color de Avatar</label>
                    <div className="flex flex-wrap gap-2">
                      {PALETTE.map((col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => setCompanionColor(col)}
                          className={`w-7 h-7 rounded-full ${col} border transition-all cursor-pointer ${
                            companionColor === col 
                              ? 'ring-2 ring-indigo-500 border-white scale-110' 
                              : 'border-transparent hover:scale-105'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 border-t border-slate-50 bg-slate-50 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCompanionModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                  >
                    Atrás
                  </button>
                  <button
                    type="submit"
                    className="px-4.5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Unir al viaje
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: EDIT COMPANION */}
      <AnimatePresence>
        {editingFriend && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden border border-slate-100"
            >
              <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 font-display">
                  <Pencil className="w-5 h-5 text-teal-600" />
                  Editar Viajero
                </h3>
                <button
                  onClick={() => setEditingFriend(null)}
                  className="p-1 px-2.5 hover:bg-slate-250 hover:text-slate-705 text-slate-400 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                if (!editName.trim()) return;
                onEditFriend(editingFriend.id, editName.trim(), editEmoji, editColor);
                setEditingFriend(null);
              }}>
                <div className="p-5 space-y-4">
                  <div className="space-y-1.5 border-b border-slate-50 pb-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Nombre del Viajero</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition-all"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Emoji selector */}
                  <div className="space-y-2 text-left">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Su Logotipo / Emoji de Viaje</label>
                    <div className="grid grid-cols-6 gap-2">
                       {EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setEditEmoji(emoji)}
                          className={`w-10 h-10 text-lg rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                            editEmoji === emoji 
                              ? 'bg-teal-55 border-teal-500 scale-105' 
                              : 'bg-white border-slate-150 hover:bg-slate-50'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color selector */}
                  <div className="space-y-2 pt-2 text-left">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Poner un color nuevo</label>
                    <div className="flex flex-wrap gap-2">
                      {PALETTE.map((col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => setEditColor(col)}
                          className={`w-7 h-7 rounded-full ${col} border transition-all cursor-pointer ${
                            editColor === col 
                              ? 'ring-2 ring-indigo-500 border-white scale-110' 
                              : 'border-transparent hover:scale-105'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Option: Delete Companion */}
                  {onDeleteFriend && (
                    <div className="pt-4 border-t border-slate-100 mt-4">
                      {!showConfirmDelete ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (friends.length <= 1) {
                              setDeleteError("Debe haber por lo menos un viajero en este itinerario.");
                            } else {
                              setShowConfirmDelete(true);
                              setDeleteError('');
                            }
                          }}
                          className="w-full py-2 border border-rose-200 hover:border-rose-300 text-rose-600 hover:bg-rose-50/50 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Eliminar Viajero de este Viaje
                        </button>
                      ) : (
                        <div className="bg-rose-50/50 border border-rose-150 rounded-xl p-3 space-y-2 text-xs text-left">
                          <p className="font-bold text-rose-800 flex items-center gap-1">⚠️ ¡ATENCIÓN CRÍTICA!</p>
                          <p className="text-rose-605 font-medium leading-relaxed">Se borrará absolutamente TODO lo relacionado a este integrante: sus gastos individuales, saldos compartidos, deudas registradas y documentos de vuelo. Esta acción es definitiva.</p>
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteFriend(editingFriend.id);
                                setEditingFriend(null);
                                setShowConfirmDelete(false);
                              }}
                              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[11px] cursor-pointer shadow-xs transition-colors"
                            >
                              Sí, Eliminar
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowConfirmDelete(false)}
                              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg font-bold text-[11px] cursor-pointer transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}

                      {deleteError && (
                        <p className="text-rose-600 font-bold text-[10px] leading-snug mt-2 bg-rose-50/40 p-2 border border-rose-100 rounded-lg text-left">
                          ⚠️ {deleteError}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-5 border-t border-slate-50 bg-slate-50 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingFriend(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-750 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4.5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </aside>
  );
}

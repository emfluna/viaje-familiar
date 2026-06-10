/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TripDay, Friend } from '../types';
import { 
  Calendar, 
  MapPin, 
  Plus, 
  Users, 
  UserPlus, 
  X, 
  ArrowRight,
  Compass,
  Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  days: TripDay[];
  friends: Friend[];
  selectedDayId: string; // "all" or specific DayDay ID
  onSelectDay: (id: string) => void;
  onAddDay: (dateString: string) => void;
  onAddFriend: (name: string, emoji: string) => void;
  currentUserId: string;
}

const PALETTE = [
  'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 
  'bg-indigo-500', 'bg-violet-500', 'bg-rose-500', 
  'bg-pink-500', 'bg-amber-500', 'bg-orange-500'
];

const EMOJIS = ['🦁', '🦊', '🦒', '🐼', '🐨', '🐠', '🐬', '🦄', '🐳', '🦉', '🐱', '🐶'];

export default function Sidebar({
  days,
  friends,
  selectedDayId,
  onSelectDay,
  onAddDay,
  onAddFriend,
  currentUserId,
}: SidebarProps) {
  const [showAddDayModal, setShowAddDayModal] = useState(false);
  const [showCompanionModal, setShowCompanionModal] = useState(false);

  // New Day forms states
  const [newDayDate, setNewDayDate] = useState('');

  // Companion form states
  const [companionName, setCompanionName] = useState('');
  const [companionEmoji, setCompanionEmoji] = useState(EMOJIS[0]);

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
    onAddFriend(companionName.trim(), companionEmoji);
    setCompanionName('');
    setCompanionEmoji(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
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
                        <span className="text-xs text-slate-400 font-medium block">
                          {formatDate(day.date)}
                        </span>
                        <span className="text-xs font-semibold block truncate">
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
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-sm border border-slate-105 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-xs shrink-0 ${friend.avatarColor}`}>
                      {friend.avatarEmoji}
                    </div>
                    <span className="font-semibold text-slate-700 truncate">
                      {friend.name} {isCurrentUser && <span className="text-slate-400 text-xs font-normal italic">(Tú)</span>}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ADVENTURE TRIVIA AD / INFO IN SIDEBAR MARGIN */}
      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <div className="p-3 bg-white rounded-2xl border border-slate-100 flex items-start gap-2.5">
          <Trophy className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed text-slate-500">
            <b className="font-bold text-slate-700 block">Sostenibilidad del Presupuesto</b>
            Divide los costos de Hospedaje y Atracciones equitativamente para lograr el mínimo saldo de deudas directas.
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

      {/* MODAL: ADD COMPANION */}
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

                  {/* Emoji selector */}
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
    </aside>
  );
}

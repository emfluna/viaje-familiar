/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Friend, Expense, Currency, CURRENCY_SYMBOLS } from '../types';
import { Compass, Users, Plane, Calendar, Wallet, UserPlus, Trash2, X, Plus, Sparkles, Check } from 'lucide-react';
import Avatar from './Avatar';

interface TravelHeaderProps {
  friends: Friend[];
  currentUserId: string;
  onUserChange: (id: string) => void;
  expenses: Expense[];
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  budgetLimit: number;
  onBudgetLimitChange: (limit: number) => void;
  isOffline: boolean;
  onAddFriend?: (name: string, emoji: string, color?: string) => void;
  onDeleteFriend?: (id: string) => void;
}

const QUICK_EMOJIS = ['✈️', '😎', '🎒', '🌴', '💃', '📸', '🏖️', '🇧🇷', '🗺️', '🍔', '☀️'];

export default function TravelHeader({
  friends,
  currentUserId,
  onUserChange,
  expenses,
  currency,
  onCurrencyChange,
  budgetLimit,
  onBudgetLimitChange,
  isOffline,
  onAddFriend,
  onDeleteFriend,
}: TravelHeaderProps) {
  const currentUserObj = friends.find((f) => f.id === currentUserId) || friends[0];

  // Calculated high-level metrics
  const nonSettlementExpenses = expenses.filter((e) => !e.isSettlement);
  const totalTripCost = nonSettlementExpenses.reduce((sum, e) => sum + e.amount, 0);

  const foodCost = nonSettlementExpenses
    .filter((e) => e.category === 'alimentacion')
    .reduce((sum, e) => sum + e.amount, 0);

  const lodgingCost = nonSettlementExpenses
    .filter((e) => e.category === 'hospedaje')
    .reduce((sum, e) => sum + e.amount, 0);

  // States for friends interactive panel
  const [isManaging, setIsManaging] = useState(false);
  const [newFriendName, setNewFriendName] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-teal-500');
  const [showSpotify, setShowSpotify] = useState(false);

  const handleCreateFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendName.trim()) return;
    if (onAddFriend) {
      onAddFriend(newFriendName.trim(), '👤', selectedColor);
      setNewFriendName('');
    }
  };

  return (
    <header 
      className="text-white min-h-[100px] py-4 px-6 sticky top-0 z-40 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-visible"
      style={{
        backgroundImage: "linear-gradient(to right, rgba(15, 23, 42, 0.75), rgba(15, 118, 110, 0.65)), url('https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1500&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Semi-transparent blur overlay for excellent text contrast */}
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] z-0 pointer-events-none" />

      {/* Brand & Concept with Brasil SVG Logo */}
      <div className="flex items-center gap-3 select-none relative z-10">
        <div className="w-12 h-12 bg-[#009c3b] rounded-2xl flex items-center justify-center border border-white/40 shadow-md transform hover:scale-110 transition-transform relative overflow-hidden" title="Brasil">
          <div className="absolute inset-x-0 bottom-0 top-[60%] bg-yellow-400/10 blur-[2px]" />
          <svg viewBox="0 0 100 70" className="w-9 h-6 relative z-10 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] rounded-md">
            <rect width="100" height="70" fill="#009c3b" />
            <polygon points="50,6 92,35 50,64 8,35" fill="#ffdf00" />
            <circle cx="50" cy="35" r="15" fill="#002776" />
            <path d="M 35,37 Q 50,29 65,37" stroke="#ffffff" strokeWidth="2" fill="none" />
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold font-display tracking-tight text-lg text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              Viaje Familiar
            </span>
          </div>
          <span className="text-[10px] text-emerald-100/90 block drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] max-w-xs md:max-w-md lg:max-w-xl leading-relaxed whitespace-normal italic">
            "Dentro de veinte años estarás más decepcionado por las cosas que no hiciste que por las que hiciste"
          </span>
        </div>
      </div>

      {/* Global quick glance indicators */}
      <div className="hidden lg:flex items-center gap-4 text-[10px] text-emerald-100 bg-black/30 backdrop-blur-md py-1.5 px-3 rounded-lg border border-white/10 font-bold select-none relative z-10">
        <div className="flex items-center gap-1.5 border-r border-white/15 pr-3">
          <Plane className="w-3 h-3 text-emerald-300" />
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-300 uppercase">Gasto Total</span>
            <span className="font-mono text-white text-[11px]">{CURRENCY_SYMBOLS[currency]} {totalTripCost.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 border-r border-white/15 pr-3">
          <span className="text-xs">🍔</span>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-350 uppercase">Comida</span>
            <span className="font-mono text-white text-[11px]">{CURRENCY_SYMBOLS[currency]} {foodCost.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs">🏨</span>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-350 uppercase">Hotel</span>
            <span className="font-mono text-white text-[11px]">{CURRENCY_SYMBOLS[currency]} {lodgingCost.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Traveler Simulator dropdown & Budget Control */}
      <div className="flex flex-wrap items-center justify-center gap-3 self-center md:self-auto relative animate-fade-in z-10">
        
        {/* Spotify Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowSpotify(!showSpotify)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer border-2 ${
              showSpotify ? 'bg-emerald-500 border-white scale-110' : 'bg-black/40 border-white/20 hover:bg-black/60'
            }`}
            title="Música para el viaje 🎵"
          >
            <Compass className={`w-5 h-5 ${showSpotify ? 'text-white animate-pulse' : 'text-emerald-400'}`} />
          </button>

          {showSpotify && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-64 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-3 z-50 animate-spring-up overflow-hidden">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Vibra Brasil 🇧🇷</span>
                </span>
                <button onClick={() => setShowSpotify(false)} className="text-slate-500 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <iframe 
                style={{ borderRadius: '12px' }} 
                src="https://open.spotify.com/embed/playlist/3TqICupAgz1dyriD5fPemD?utm_source=generator&theme=0" 
                width="100%" 
                height="152" 
                frameBorder="0" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
              ></iframe>
              <p className="text-[8px] text-emerald-500/80 text-center font-bold italic mt-2">
                "A música alimenta a alma do viajante"
              </p>
            </div>
          )}
        </div>

        {/* Unificado: Selector de Amigos y botón de administración del grupo */}
          <div className="flex flex-col items-center gap-1 min-w-[120px]">
             <span className="text-[10px] font-black font-sans text-emerald-200 uppercase tracking-tighter drop-shadow-md">
               {currentUserObj?.name || 'Viajero'}
             </span>
             <div className="relative">
              <select
                id="select-simulated-user"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                value={currentUserId}
                onChange={(e) => onUserChange(e.target.value)}
              >
                {friends.map((f) => (
                  <option key={f.id} value={f.id} className="text-slate-800 font-medium">
                    {f.name}
                  </option>
                ))}
              </select>
              
              {/* Active companion visual badge and toggle manager panel */}
              <button
                onClick={() => setIsManaging(!isManaging)}
                className="flex items-center justify-center transition-opacity hover:opacity-80 active:scale-95 cursor-pointer relative z-10"
                title="Administrar Grupo de Viajeros (Simulador)"
              >
                {currentUserObj ? <Avatar friend={currentUserObj} size="md" /> : '👥'}
              </button>
            </div>
          </div>

        {/* POPUP FLOTANTE DE GESTIÓN DE AMIGOS */}
        {isManaging && (
          <div className="absolute right-0 top-full mt-2.5 w-76 bg-white rounded-2xl border border-slate-200 shadow-xl text-slate-800 p-4.5 z-55 animate-fade-in space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5 text-indigo-900">
                <Users className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-wide font-sans">Gestionar Viajeros</span>
              </div>
              <button 
                onClick={() => setIsManaging(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-650 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List to withdraw / anular o remover amigos */}
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block font-sans">Integrantes ({friends.length}):</span>
              {friends.map((friend) => {
                const isPayerActive = friend.id === currentUserId;
                return (
                  <div key={friend.id} className="flex items-center justify-between p-1.5 bg-slate-50 rounded-xl border border-slate-100 hover:bg-indigo-50/20 transition-all">
                    <div className="flex items-center gap-2">
                      <Avatar friend={friend} size="md" />
                      <span className={`text-[11px] font-bold ${isPayerActive ? 'text-indigo-600 font-extrabold' : 'text-slate-700'}`}>
                        {friend.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isPayerActive && (
                        <span className="text-[8px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-1 py-0.2 rounded-md font-bold uppercase tracking-wider font-sans">
                          Activo
                        </span>
                      )}
                      
                      {friends.length > 1 && onDeleteFriend && (
                        <button
                          onClick={() => {
                            if (window.confirm(`⚠️ ¡ATENCIÓN! Se borrará absolutamente TODO lo relacionado a este viajero (sus deudas, gastos individuales, divisiones de cuentas de viaje y pasajes o documentos registrados). ¿Estás completamente seguro de que deseas eliminar permanentemente a ${friend.name}?`)) {
                              onDeleteFriend(friend.id);
                              // Reset active user if the active user is deleted
                              if (isPayerActive) {
                                const nextLeftover = friends.find(f => f.id !== friend.id);
                                if (nextLeftover) {
                                  onUserChange(nextLeftover.id);
                                }
                              }
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer animate-fade-in"
                          title="Anular / Retirar este viajero"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Form to add a new traveler */}
            {onAddFriend && (
              <form onSubmit={handleCreateFriend} className="border-t border-slate-100 pt-3 space-y-2.5">
                <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block font-sans">Agregar de forma offline:</span>
                <div className="flex gap-1.5">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Nombre viajero..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-450 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={newFriendName}
                      onChange={(e) => setNewFriendName(e.target.value)}
                      maxLength={18}
                    />
                  </div>
                  <button
                    type="submit"
                    className="p-1 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center transition-colors shadow-sm cursor-pointer shrink-0"
                    title="Agregar"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}


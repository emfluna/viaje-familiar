/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Friend, Expense, Currency, CURRENCY_SYMBOLS } from '../types';
import { Compass, Users, Plane, Calendar, Wallet, UserPlus, Trash2, X, Plus, Sparkles, Check } from 'lucide-react';

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
  const [selectedEmoji, setSelectedEmoji] = useState('🎒');
  const [selectedColor, setSelectedColor] = useState('bg-teal-500');

  const handleCreateFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendName.trim()) return;
    if (onAddFriend) {
      onAddFriend(newFriendName.trim(), selectedEmoji, selectedColor);
      setNewFriendName('');
      // Set to another random emoji
      setSelectedEmoji(QUICK_EMOJIS[Math.floor(Math.random() * QUICK_EMOJIS.length)]);
    }
  };

  return (
    <header 
      className="text-white min-h-[100px] py-4 px-6 sticky top-0 z-40 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden"
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
          <span className="text-xs text-emerald-100/90 block drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
            Diviértanse mucho.
          </span>
        </div>
      </div>

      {/* Connection Mode Status Flag */}
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-extrabold uppercase tracking-wider select-none transition-all relative z-10 ${
        isOffline 
          ? 'bg-amber-500/30 text-amber-105 border-amber-500/40 shadow-xs' 
          : 'bg-emerald-500/30 text-emerald-100 border-emerald-500/40'
      }`}>
        <span className="relative flex h-2 w-2">
          {isOffline && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${isOffline ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
        </span>
        <span>{isOffline ? 'Modo sin conexión' : 'Conectado'}</span>
      </div>

      {/* Global quick glance indicators */}
      <div className="hidden lg:flex items-center gap-6 text-xs text-emerald-100 bg-black/30 backdrop-blur-md py-2 px-4 rounded-xl border border-white/10 font-medium select-none relative z-10">
        <div className="flex items-center gap-2 border-r border-white/15 pr-4">
          <Plane className="w-4 h-4 text-emerald-300" />
          <div>
            <span className="text-emerald-300 font-semibold block text-[10px] uppercase">Gasto Total</span>
            <span className="font-mono text-white text-sm font-bold">{CURRENCY_SYMBOLS[currency]} {totalTripCost.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 border-r border-white/15 pr-4">
          <div className="text-sm">🍔</div>
          <div>
            <span className="text-emerald-350 font-semibold block text-[10px] uppercase font-sans">Alimentación</span>
            <span className="font-mono text-white text-sm font-bold">{CURRENCY_SYMBOLS[currency]} {foodCost.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm">🏨</div>
          <div>
            <span className="text-emerald-350 font-semibold block text-[10px] uppercase font-sans">Hospedaje</span>
            <span className="font-mono text-white text-sm font-bold">{CURRENCY_SYMBOLS[currency]} {lodgingCost.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Traveler Simulator dropdown & Budget Control */}
      <div className="flex flex-wrap items-center gap-3 self-end md:self-auto relative animate-fade-in z-10">
        {/* Interactive Budget Regulator Control box */}
        <div className="bg-white/15 backdrop-blur-md border border-white/20 p-1 rounded-xl flex items-center gap-1.5 shadow-inner">
          <span className="text-[10px] font-extrabold text-teal-100 pl-2 uppercase tracking-wide font-sans">
            Presupuesto:
          </span>
          <div className="flex items-center gap-1 bg-black/25 rounded-md px-1.5 py-0.5 border border-white/10">
            <button
              onClick={() => onBudgetLimitChange(Math.max(100, budgetLimit - 100))}
              className="w-4 h-4 bg-white/10 hover:bg-white/20 text-white rounded flex items-center justify-center text-[10px] font-black cursor-pointer select-none"
              title="Reducir límite"
            >
              -
            </button>
            <input
              type="text"
              id="input-budget-header"
              className="w-12 text-center bg-transparent border-none text-white font-mono text-xs font-bold leading-tight p-0 focus:outline-none focus:ring-0"
              value={budgetLimit}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) onBudgetLimitChange(val);
                else if (e.target.value === '') onBudgetLimitChange(0);
              }}
            />
            <button
              onClick={() => onBudgetLimitChange(budgetLimit + 100)}
              className="w-4 h-4 bg-white/10 hover:bg-white/20 text-white rounded flex items-center justify-center text-[10px] font-black cursor-pointer select-none"
              title="Incrementar límite"
            >
              +
            </button>
          </div>
          <span className="text-[10px] text-teal-150 font-mono pr-2 font-bold select-none">
            {CURRENCY_SYMBOLS[currency]}
          </span>
        </div>

        {/* Unificado: Selector de Amigos y botón de administración del grupo */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-1 rounded-xl flex items-center gap-1.5 shadow-md">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-emerald-200 pl-2 hidden lg:inline uppercase tracking-wider font-sans">
              Viajero:
            </span>
            <div className="relative">
              <select
                id="select-simulated-user"
                className="bg-slate-900/60 font-semibold text-white text-xs border border-white/10 px-3 py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-400 cursor-pointer appearance-none pr-8 py-1"
                value={currentUserId}
                onChange={(e) => onUserChange(e.target.value)}
              >
                {friends.map((f) => (
                  <option key={f.id} value={f.id} className="text-slate-800 font-medium">
                    {f.name}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="w-3.5 h-3.5 absolute right-2 top-2 text-emerald-300 pointer-events-none" />
            </div>
          </div>

          {/* Active companion visual badge and toggle manager panel */}
          <button
            onClick={() => setIsManaging(!isManaging)}
            className={`w-8.5 h-8.5 rounded-lg flex items-center justify-center text-lg font-bold transition-all relative border cursor-pointer hover:scale-105 active:scale-95 ${
              isManaging 
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/35' 
                : 'bg-white/15 border-white/20 text-white'
            }`}
            title="Administrar Grupo de Viajeros (Simulador)"
          >
            {currentUserObj ? currentUserObj.avatarEmoji : '👥'}
            <span className="absolute -bottom-1 -right-1 bg-teal-500 text-[8px] font-bold rounded-full px-1 border border-indigo-900 leading-none py-0.5">
              {friends.length}
            </span>
          </button>
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
                      <span className={`w-7 h-7 rounded-lg text-xs font-bold text-white flex items-center justify-center ${friend.avatarColor}`}>
                        {friend.avatarEmoji}
                      </span>
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
                  <div className="relative">
                    <select
                      className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 text-center"
                      value={selectedEmoji}
                      onChange={(e) => setSelectedEmoji(e.target.value)}
                    >
                      {QUICK_EMOJIS.map(em => (
                        <option key={em} value={em}>{em}</option>
                      ))}
                    </select>
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


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Friend, Expense } from '../types';
import { Compass, Users, Plane, Calendar, Wallet } from 'lucide-react';

interface TravelHeaderProps {
  friends: Friend[];
  currentUserId: string;
  onUserChange: (id: string) => void;
  expenses: Expense[];
}

export default function TravelHeader({
  friends,
  currentUserId,
  onUserChange,
  expenses,
}: TravelHeaderProps) {
  const currentUserObj = friends.find((f) => f.id === currentUserId) || friends[0];

  // Calculate high-level stats
  const nonSettlementExpenses = expenses.filter((e) => !e.isSettlement);
  const totalTripCost = nonSettlementExpenses.reduce((sum, e) => sum + e.amount, 0);

  const foodCost = nonSettlementExpenses
    .filter((e) => e.category === 'alimentacion')
    .reduce((sum, e) => sum + e.amount, 0);

  const lodgingCost = nonSettlementExpenses
    .filter((e) => e.category === 'hospedaje')
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <header className="bg-gradient-to-r from-emerald-600 via-teal-700 to-indigo-800 text-white min-h-[80px] py-4 px-6 sticky top-0 z-40 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Brand & Concept */}
      <div className="flex items-center gap-3 select-none">
        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 animate-spin-slow">
          <Compass className="w-7 h-7 text-emerald-200" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold font-display tracking-tight text-lg text-white">
              Viaje Familiar
            </span>
            <span className="text-[10px] bg-emerald-500/30 text-emerald-100 font-semibold px-2 py-0.5 rounded-full border border-emerald-400/20">
              Trip Planner & Spend Sync
            </span>
          </div>
          <span className="text-xs text-emerald-100/80 block">
            no se olviden de su regalo de efrain
          </span>
        </div>
      </div>

      {/* Global quick glance indicators */}
      <div className="hidden lg:flex items-center gap-6 text-xs text-emerald-100 bg-black/15 py-2 px-4 rounded-xl border border-white/5 font-medium select-none">
        <div className="flex items-center gap-2 border-r border-white/10 pr-4">
          <Plane className="w-4 h-4 text-emerald-300" />
          <div>
            <span className="text-emerald-300 font-semibold block text-[10px] uppercase">Gasto Total</span>
            <span className="font-mono text-white text-sm font-bold">{totalTripCost.toFixed(2)} €</span>
          </div>
        </div>
        <div className="flex items-center gap-2 border-r border-white/10 pr-4">
          <div className="text-sm">🍔</div>
          <div>
            <span className="text-emerald-300 font-semibold block text-[10px] uppercase">Alimentación</span>
            <span className="font-mono text-white text-sm font-bold">{foodCost.toFixed(2)} €</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm">🏨</div>
          <div>
            <span className="text-emerald-300 font-semibold block text-[10px] uppercase">Hospedaje</span>
            <span className="font-mono text-white text-sm font-bold">{lodgingCost.toFixed(2)} €</span>
          </div>
        </div>
      </div>

      {/* Traveler Simulator dropdown */}
      <div className="flex items-center gap-3 self-end md:self-auto">
        <div className="bg-white/10 backdrop-blur-md border border-white/15 p-1 rounded-xl flex items-center gap-2 shadow-inner">
          <span className="text-[11px] font-bold text-emerald-200 pl-2 hidden sm:inline uppercase tracking-wider">
            Viajero Activo:
          </span>
          <div className="relative">
            <select
              id="select-simulated-user"
              className="bg-slate-900/60 font-semibold text-white text-xs border border-white/10 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-400 cursor-pointer appearance-none pr-8 py-1"
              value={currentUserId}
              onChange={(e) => onUserChange(e.target.value)}
            >
              {friends.map((f) => (
                <option key={f.id} value={f.id} className="text-slate-800 font-medium">
                  {f.name} {f.id === 'u_1' ? '(Tú)' : ''}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-emerald-300 pointer-events-none" />
          </div>
        </div>

        {/* Companion visual badge */}
        {currentUserObj && (
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-md bg-white/10 border border-white/20">
            {currentUserObj.avatarEmoji}
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

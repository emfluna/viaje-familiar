/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { Expense, Friend } from '../types';
import { Tag, TrendingUp, Compass, Landmark } from 'lucide-react';

interface DashboardChartsProps {
  expenses: Expense[];
  friends: Friend[];
}

const CATEGORY_COLORS: Record<string, string> = {
  alimentacion: 'bg-amber-500 text-amber-800 border-amber-100',
  hospedaje: 'bg-violet-500 text-violet-800 border-violet-100',
  transporte: 'bg-cyan-500 text-cyan-800 border-cyan-100',
  lugares: 'bg-rose-500 text-rose-800 border-rose-100',
  otros: 'bg-slate-500 text-slate-800 border-slate-100',
};

const CATEGORY_LABELS: Record<string, string> = {
  alimentacion: 'Alimentación 🍔',
  hospedaje: 'Hospedaje 🏨',
  transporte: 'Transporte 🚗',
  lugares: 'Visitas y Atracciones 🎟️',
  otros: 'Recuerdos y Compras 📦',
};

export default function DashboardCharts({ expenses, friends }: DashboardChartsProps) {
  // Filter out payments
  const nonSettlementExpenses = expenses.filter((e) => !e.isSettlement);
  const totalSpent = nonSettlementExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Group by category
  const categoryTotals: Record<string, number> = {};
  nonSettlementExpenses.forEach((exp) => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const categoryList = Object.keys(CATEGORY_LABELS)
    .map((catKey) => {
      const amount = categoryTotals[catKey] || 0;
      const pct = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
      return {
        key: catKey,
        label: CATEGORY_LABELS[catKey],
        amount,
        pct,
        bgColor: CATEGORY_COLORS[catKey]?.split(' ')[0] || 'bg-slate-400',
      };
    })
    .sort((a, b) => b.amount - a.amount);

  // Group by traveler contribution
  const friendContributions: Record<string, number> = {};
  friends.forEach((f) => {
    friendContributions[f.id] = 0;
  });
  nonSettlementExpenses.forEach((exp) => {
    if (friendContributions[exp.payerId] !== undefined) {
      friendContributions[exp.payerId] += exp.amount;
    }
  });

  const participantContributions = friends
    .map((f) => ({
      ...f,
      amount: friendContributions[f.id] || 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const maxContribution = Math.max(...participantContributions.map((p) => p.amount), 1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Box 1: Expenses by category */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
          <Tag className="w-5 h-5 text-teal-650" />
          <div>
            <h4 className="font-semibold text-slate-800 text-sm font-display">Gastos de Viaje por Categoría</h4>
            <p className="text-xs text-slate-400">Distribución del presupuesto (Suma: {totalSpent.toFixed(2)} €)</p>
          </div>
        </div>

        <div className="space-y-3.5">
          {totalSpent === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 italic">
              Ingresa compras de viaje para representarlas por sector.
            </div>
          ) : (
            categoryList.map((cat) => {
              if (cat.amount === 0) return null; // Only show active categories
              return (
                <div key={cat.key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-650">
                    <span className="text-slate-700 font-semibold">{cat.label}</span>
                    <span className="font-mono text-slate-600 font-bold">
                      {cat.amount.toFixed(2)} € ({cat.pct.toFixed(0)}%)
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cat.bgColor} rounded-full transition-all duration-500`}
                      style={{ width: `${cat.pct}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Box 2: Total contribution per friend */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
          <TrendingUp className="w-5 h-5 text-teal-650" />
          <div>
            <h4 className="font-semibold text-slate-800 text-sm font-display">Financiamiento Aportado</h4>
            <p className="text-xs text-slate-400">Quién ha desembolsado más dinero físico</p>
          </div>
        </div>

        <div className="space-y-4">
          {totalSpent === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 italic">
              Registra transacciones para monitorear aportes.
            </div>
          ) : (
            participantContributions.map((contrib) => {
              const barPct = (contrib.amount / maxContribution) * 100;
              return (
                <div key={contrib.id} className="flex items-center gap-3">
                  {/* Friend Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-xs shrink-0 ${contrib.avatarColor}`}>
                    {contrib.avatarEmoji}
                  </div>

                  {/* Graph bar line content */}
                  <div className="flex-1 space-y-1 min-w-0 font-display">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span className="truncate">{contrib.name}</span>
                      <span className="font-mono text-slate-800 font-bold shrink-0">
                        {contrib.amount.toFixed(2)} €
                      </span>
                    </div>

                    <div className="h-2.5 w-full bg-slate-100 rounded-full flex items-center">
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{ 
                          width: `${barPct}%`,
                          backgroundColor: contrib.amount > 0 ? '#0d9488' : '#cbd5e1' 
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

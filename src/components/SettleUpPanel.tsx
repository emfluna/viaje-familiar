/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Expense, Friend, Debt, Currency, CURRENCY_SYMBOLS } from '../types';
import { calculateBalances, simplifyDebts } from '../utils/debts';
import { 
  DollarSign, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  Heart, 
  Activity, 
  HelpCircle,
  PiggyBank,
  CheckCircle2,
  Users
} from 'lucide-react';
import { motion } from 'motion/react';

interface SettleUpPanelProps {
  expenses: Expense[];
  friends: Friend[];
  onSettleDebt: (fromId: string, toId: string, amount: number) => void;
  currentUserId: string;
  currency: Currency;
}

export default function SettleUpPanel({
  expenses,
  friends,
  onSettleDebt,
  currentUserId,
  currency,
}: SettleUpPanelProps) {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Compute total balances & peer debts in real-time with our utilities
  const balances = calculateBalances(expenses, friends);
  const simplifiedDebts = simplifyDebts(balances);

  const getFriendObj = (id: string) => friends.find((f) => f.id === id);

  const triggerSettleDebt = (fromId: string, toId: string, amount: number) => {
    onSettleDebt(fromId, toId, amount);
    const fromName = getFriendObj(fromId)?.name || 'Viajero';
    const toName = getFriendObj(toId)?.name || 'Viajero';
    setSuccessMsg(`¡Pago registrado! ${fromName} saldó ${CURRENCY_SYMBOLS[currency]} ${amount.toFixed(2)} con ${toName}`);
    setTimeout(() => {
      setSuccessMsg(null);
    }, 4000);
  };

  const hasDebts = simplifiedDebts.length > 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-slate-50">
        <h3 className="font-bold text-slate-800 text-sm font-display flex items-center gap-2">
          🤝 Liquidación de Deudas & Saldos
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Cálculos automáticos del estado de cuentas de todos los viajeros.
        </p>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-6">
        
        {/* Success Notice overlay */}
        {successMsg && (
          <div className="bg-emerald-55 border border-emerald-150 p-3 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-semibold animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. VISUAL BALANCES CHART/GRID */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block px-1">
            Saldos Individuales
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {friends.map((friend) => {
              const bal = balances[friend.id] || 0;
              const isPositive = bal >= 0;
              const isMe = friend.id === currentUserId;
              
              return (
                <div
                  key={friend.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isPositive 
                      ? 'bg-emerald-50/20 border-emerald-100/55' 
                      : 'bg-rose-50/20 border-rose-100/55'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 shadow-3xs ${friend.avatarColor}`}>
                        {friend.avatarEmoji}
                      </div>
                      <div className="text-left truncate">
                        <span className="font-bold text-slate-700 text-xs block truncate">
                          {friend.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-medium">
                          {isMe ? 'Tú como viajero' : 'Participante'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right font-mono shrink-0">
                      <span className={`text-xs font-bold block ${isPositive ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {isPositive ? '+' : ''}{CURRENCY_SYMBOLS[currency]} {bal.toFixed(2)}
                      </span>
                      <span className="text-[9px] text-slate-400 block font-semibold leading-none">
                        {isPositive ? 'Dinero a recibir' : 'Debe aportar'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. DIRECT DEBTS SIMPLIFICATION */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              Estrategia de Pagos Directos
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full border border-slate-150">
              Método simplificado
            </span>
          </div>

          {!hasDebts ? (
            <div className="bg-emerald-50/30 rounded-2xl p-6 border border-emerald-100/60 text-center flex flex-col items-center justify-center">
              <PiggyBank className="w-10 h-10 text-emerald-600/80 mb-2 stroke-1" />
              <p className="text-xs text-emerald-800 font-bold">¡Cuentas al día! 🎉</p>
              <p className="text-[10px] text-emerald-750/80 max-w-xs mt-1">
                No hay deudas simplificadas pendientes por liquidar. Las aportaciones cubren equitativamente la totalidad de los gastos del viaje.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {simplifiedDebts.map((debt, index) => {
                const debtor = getFriendObj(debt.fromId);
                const creditor = getFriendObj(debt.toId);

                if (!debtor || !creditor) return null;

                const isDebtorMe = debt.fromId === currentUserId;
                const isCreditorMe = debt.toId === currentUserId;

                return (
                  <div
                    key={`${debt.fromId}-${debt.toId}-${index}`}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isDebtorMe 
                        ? 'border-indigo-200 bg-indigo-50/20' 
                        : isCreditorMe 
                          ? 'border-emerald-200 bg-emerald-50/20'
                          : 'border-slate-105 bg-white'
                    } flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs`}
                  >
                    {/* Visual debt route */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1.5 bg-slate-100/80 border border-slate-200/50 py-1 px-2.5 rounded-lg font-medium text-slate-700">
                        <span>{debtor.avatarEmoji}</span>
                        <span className="font-bold">{debtor.name}</span>
                      </div>
                      
                      <div className="flex flex-col items-center shrink-0 text-slate-400">
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                        <span className="text-[8px] font-bold uppercase tracking-wider">Debe</span>
                      </div>

                      <div className="flex items-center gap-1.5 bg-slate-100/80 border border-slate-200/50 py-1 px-2.5 rounded-lg font-medium text-slate-700">
                        <span>{creditor.avatarEmoji}</span>
                        <span className="font-bold">{creditor.name}</span>
                      </div>
                    </div>

                    {/* Settle button */}
                    <div className="flex items-center justify-between sm:justify-end gap-3.5 border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0 font-mono">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-slate-400 block font-semibold leading-none">Monto</span>
                        <span className="text-sm font-black text-slate-800">{CURRENCY_SYMBOLS[currency]} {debt.amount.toFixed(2)}</span>
                      </div>

                      <button
                        id={`btn-settle-direct-${debt.fromId}-${debt.toId}`}
                        onClick={() => triggerSettleDebt(debt.fromId, debt.toId, debt.amount)}
                        className={`text-[10px] font-extrabold tracking-tight px-3.5 py-2 rounded-xl border shadow-3xs cursor-pointer transition-all ${
                          isDebtorMe 
                            ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-500' 
                            : 'bg-slate-800 hover:bg-slate-900 text-white border-slate-750'
                        }`}
                      >
                        {isDebtorMe ? '¡Pagar mi Deuda!' : 'Liquidar Deuda'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

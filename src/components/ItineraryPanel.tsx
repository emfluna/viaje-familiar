/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TripDay, TouristPlace } from '../types';
import { 
  MapPin, 
  Map, 
  Clock, 
  CheckCircle, 
  Circle, 
  Plus, 
  Trash2, 
  DollarSign, 
  Smile,
  Compass,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ItineraryPanelProps {
  selectedDay: TripDay | undefined;
  onToggleVisited: (dayId: string, placeId: string) => void;
  onAddPlace: (dayId: string, place: Omit<TouristPlace, 'id' | 'isVisited'>) => void;
  onRemovePlace: (dayId: string, placeId: string) => void;
}

export default function ItineraryPanel({
  selectedDay,
  onToggleVisited,
  onAddPlace,
  onRemovePlace,
}: ItineraryPanelProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('10:00');
  const [estimatedCost, setEstimatedCost] = useState('0');

  if (!selectedDay) {
    return (
      <div className="bg-slate-55/40 rounded-3xl p-6 border border-slate-100 flex flex-col items-center justify-center text-center py-12">
        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4 shadow-sm">
          <Map className="w-7 h-7" />
        </div>
        <h4 className="font-bold text-slate-700 text-sm">Resumen General del Viaje</h4>
        <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
          Haz clic en cualquier día específico en la barra lateral para ver su itinerario de lugares turísticos y añadir paradas de atracción del día.
        </p>
      </div>
    );
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onAddPlace(selectedDay.id, {
      name: name.trim(),
      description: description.trim(),
      timeOfDay: timeOfDay || 'Todo el día',
      estimatedCost: parseFloat(estimatedCost) || 0,
    });

    setName('');
    setDescription('');
    setTimeOfDay('10:00');
    setEstimatedCost('0');
    setShowAddForm(false);
  };

  const totalBudgetForSights = selectedDay.touristPlaces.reduce(
    (sum, place) => sum + (place.estimatedCost || 0),
    0
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-slate-50 bg-gradient-to-br from-teal-50/20 to-indigo-50/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100/50 flex items-center justify-center text-teal-600">
            <Compass className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm font-display leading-tight">
              Recorrido Turístico — Día {selectedDay.dayNumber}
            </h3>
            <p className="text-[11px] text-slate-400">
              Lugares, monumentos y paradas programadas para el {selectedDay.date}
            </p>
          </div>
        </div>

        <button
          id={`btn-add-place-day-${selectedDay.id}`}
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm cursor-pointer ml-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Añadir Lugar</span>
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-4">
        {/* Statistics Bar for tourist places */}
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex items-center justify-between">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Presupuesto Actividades Estimado
          </div>
          <div className="font-mono text-xs font-black text-slate-700 bg-white py-1 px-2.5 rounded-lg border border-slate-100 shadow-2xs">
            {totalBudgetForSights.toFixed(2)} €
          </div>
        </div>

        {/* Create Place Form inline */}
        {showAddForm && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="p-4 bg-teal-50/40 rounded-2xl border border-teal-100/80 space-y-3 overflow-hidden"
            onSubmit={handleFormSubmit}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Nueva Parada Turística
              </span>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-[10px] text-slate-400 hover:text-slate-600"
              >
                Cerrar
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <input
                  id="place-name-input"
                  type="text"
                  placeholder="Nombre de la atracción (Ej: Templo del Sol 🏛️)"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500 focus:outline-none bg-white font-medium"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <textarea
                  id="place-desc-input"
                  placeholder="Breve descripción o planes aquí..."
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500 focus:outline-none bg-white"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Hora Programada</label>
                  <input
                    type="text"
                    placeholder="Ej: 10:00 | Atardecer"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500 focus:outline-none bg-white"
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Gasto Estimado (€)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="Ej: 15"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500 focus:outline-none bg-white font-mono"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
            >
              Guardar e Incluir en el Itinerario
            </button>
          </motion.form>
        )}

        {/* Tourist place items */}
        <div className="space-y-3 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-slate-100">
          {selectedDay.touristPlaces.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Smile className="w-10 h-10 text-slate-300 stroke-1" />
              <p className="text-xs text-slate-400 mt-2 font-medium">
                No hay actividades de turismo apuntadas todavía.
              </p>
              <p className="text-[10px] text-slate-400 max-w-xs px-4">
                ¡Añade templos, playas, museos o espectáculos usando el botón superior!
              </p>
            </div>
          ) : (
            selectedDay.touristPlaces.map((place) => (
              <div
                key={place.id}
                className={`relative pl-10 group transition-all rounded-2xl p-3 border hover:border-slate-200 hover:shadow-2xs ${
                  place.isVisited
                    ? 'bg-emerald-50/20 border-emerald-100/40 opacity-80'
                    : 'bg-white border-slate-105'
                }`}
              >
                {/* Timeline ball/checkbox */}
                <button
                  id={`btn-toggle-visited-${place.id}`}
                  onClick={() => onToggleVisited(selectedDay.id, place.id)}
                  className="absolute left-2.5 top-4 cursor-pointer focus:outline-none"
                  title={place.isVisited ? 'Marcar como pendiente' : 'Marcar como completado'}
                >
                  {place.isVisited ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500 bg-white rounded-full shadow-2xs" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 hover:text-teal-400 bg-white rounded-full transition-colors" />
                  )}
                </button>

                {/* Content block */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs font-bold block leading-tight ${
                      place.isVisited ? 'text-emerald-850 line-through' : 'text-slate-800'
                    }`}>
                      {place.name}
                    </span>
                    
                    <button
                      id={`btn-remove-place-${place.id}`}
                      onClick={() => onRemovePlace(selectedDay.id, place.id)}
                      className="p-1 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-md transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Eliminar parada turística"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {place.description && (
                    <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                      {place.description}
                    </p>
                  )}

                  {/* Metadata line */}
                  <div className="flex items-center gap-3 pt-1 text-[10px] font-medium text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-350" />
                      {place.timeOfDay || 'Cualquier hora'}
                    </span>
                    {place.estimatedCost > 0 && (
                      <span className="flex items-center gap-0.5 font-mono text-emerald-700 bg-emerald-50 py-0.5 px-2 rounded-md">
                        <DollarSign className="w-2.5 h-2.5" />
                        {place.estimatedCost.toFixed(2)} € est.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

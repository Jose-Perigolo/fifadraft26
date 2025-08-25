'use client';

import { useState, useMemo } from 'react';
import { Player } from '@/types';
import { filterPlayers, sortPlayers, getAvailablePlayers } from '@/utils/players';
import PlayerCard from './PlayerCard';

interface PlayerSelectionProps {
  allPlayers: Player[];
  selectedPlayers: Player[];
  onPlayerSelect: (player: Player) => void;
  isDisabled?: boolean;
}

export default function PlayerSelection({ 
  allPlayers, 
  selectedPlayers, 
  onPlayerSelect, 
  isDisabled = false 
}: PlayerSelectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [overallRange, setOverallRange] = useState({ min: 0, max: 99 });
  const [sortBy, setSortBy] = useState('overall-desc');

  const availablePlayers = getAvailablePlayers(allPlayers, selectedPlayers);

  const displayedPlayers = useMemo(() => {
    if (!allPlayers.length) return [];
    
    let filtered = filterPlayers(
      availablePlayers,
      searchTerm,
      positionFilter || undefined,
      overallRange.min || undefined,
      overallRange.max || undefined
    );

    filtered = sortPlayers(filtered, sortBy);
    return filtered.slice(0, 50); // Limit to first 50 for performance
  }, [availablePlayers, searchTerm, positionFilter, overallRange.min, overallRange.max, sortBy]);

  const positions = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'ST', 'CF'];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Selecionar um Jogador</h2>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Buscar Jogadores
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, time ou nação..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
          />
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Position Filter */}
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
              Posição
            </label>
            <select
              id="position"
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            >
              <option value="">Todas as Posições</option>
              {positions.map((pos) => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>

          {/* Overall Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avaliação Geral
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max="99"
                value={overallRange.min}
                onChange={(e) => setOverallRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                placeholder="Mín"
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
              />
              <input
                type="number"
                min="0"
                max="99"
                value={overallRange.max}
                onChange={(e) => setOverallRange(prev => ({ ...prev, max: parseInt(e.target.value) || 99 }))}
                placeholder="Máx"
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>

          {/* Sort */}
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
              Ordenar Por
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            >
              <option value="overall-desc">Avaliação (Alta para Baixa)</option>
              <option value="overall-asc">Avaliação (Baixa para Alta)</option>
              <option value="name-asc">Nome (A-Z)</option>
              <option value="age-asc">Idade (Jovem para Velho)</option>
              <option value="age-desc">Idade (Velho para Jovem)</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-700 font-medium">
          Mostrando {displayedPlayers.length} de {availablePlayers.length} jogadores disponíveis
        </div>
      </div>

      {/* Turn Status */}
      {isDisabled && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-center text-yellow-800">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Não é sua vez de escolher um jogador</span>
          </div>
        </div>
      )}

      {/* Players Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-6">
        {displayedPlayers.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            onSelect={isDisabled ? undefined : onPlayerSelect}
            isDisabled={isDisabled}
          />
        ))}
      </div>

      {/* No Results */}
      {displayedPlayers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhum jogador encontrado com seus critérios</p>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { Player } from '@/types';
import { filterPlayers, sortPlayers, getAvailablePlayers } from '@/utils/players';
import PlayerCard from './PlayerCard';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [overallRange, setOverallRange] = useState({ min: 0, max: 99 });
  const [statsFilter, setStatsFilter] = useState({
    pac: { min: 0, max: 99 },
    sho: { min: 0, max: 99 },
    pas: { min: 0, max: 99 },
    dri: { min: 0, max: 99 },
    def: { min: 0, max: 99 },
    phy: { min: 0, max: 99 }
  });
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

    // Apply stats filtering
    filtered = filtered.filter(player => {
      return (
        player.pace >= statsFilter.pac.min && player.pace <= statsFilter.pac.max &&
        player.shooting >= statsFilter.sho.min && player.shooting <= statsFilter.sho.max &&
        player.passing >= statsFilter.pas.min && player.passing <= statsFilter.pas.max &&
        player.dribbling >= statsFilter.dri.min && player.dribbling <= statsFilter.dri.max &&
        player.defending >= statsFilter.def.min && player.defending <= statsFilter.def.max &&
        player.physical >= statsFilter.phy.min && player.physical <= statsFilter.phy.max
      );
    });

    filtered = sortPlayers(filtered, sortBy);
    return filtered.slice(0, 50); // Limit to first 50 for performance
  }, [availablePlayers, searchTerm, positionFilter, overallRange.min, overallRange.max, statsFilter, sortBy, allPlayers.length]);

  const positions = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'ST', 'CF'];

  return (
    <div className={`rounded-lg shadow-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Selecionar um Jogador</h2>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        {/* Search */}
        <div>
          <label htmlFor="search" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Buscar Jogadores
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, time ou nação..."
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              theme === 'dark' 
                ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                : 'border-gray-300 text-gray-900'
            }`}
          />
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Position Filter */}
          <div>
            <label htmlFor="position" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Posição
            </label>
            <select
              id="position"
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                theme === 'dark' 
                  ? 'border-gray-600 bg-gray-700 text-white' 
                  : 'border-gray-300 text-gray-900'
              }`}
            >
              <option value="">Todas as Posições</option>
              {positions.map((pos) => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>

          {/* Overall Range */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
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
                className={`w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  theme === 'dark' 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                    : 'border-gray-300 text-gray-900'
                }`}
              />
              <input
                type="number"
                min="0"
                max="99"
                value={overallRange.max}
                onChange={(e) => setOverallRange(prev => ({ ...prev, max: parseInt(e.target.value) || 99 }))}
                placeholder="Máx"
                className={`w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  theme === 'dark' 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                    : 'border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>

          {/* Sort */}
          <div>
            <label htmlFor="sort" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Ordenar Por
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                theme === 'dark' 
                  ? 'border-gray-600 bg-gray-700 text-white' 
                  : 'border-gray-300 text-gray-900'
              }`}
            >
              <option value="overall-desc">Avaliação (Alta para Baixa)</option>
              <option value="overall-asc">Avaliação (Baixa para Alta)</option>
              <option value="name-asc">Nome (A-Z)</option>
              <option value="age-asc">Idade (Jovem para Velho)</option>
              <option value="age-desc">Idade (Velho para Jovem)</option>
              <option value="pace-desc">Velocidade (Alta para Baixa)</option>
              <option value="pace-asc">Velocidade (Baixa para Alta)</option>
              <option value="shooting-desc">Finalização (Alta para Baixa)</option>
              <option value="shooting-asc">Finalização (Baixa para Alta)</option>
              <option value="passing-desc">Passe (Alto para Baixo)</option>
              <option value="passing-asc">Passe (Baixo para Alto)</option>
              <option value="dribbling-desc">Drible (Alto para Baixo)</option>
              <option value="dribbling-asc">Drible (Baixo para Alto)</option>
              <option value="defending-desc">Defesa (Alta para Baixa)</option>
              <option value="defending-asc">Defesa (Baixa para Alta)</option>
              <option value="physical-desc">Físico (Alto para Baixo)</option>
              <option value="physical-asc">Físico (Baixo para Alto)</option>
            </select>
          </div>
        </div>

        {/* Stats Filters */}
        <div>
          <label className={`block text-sm font-medium mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Filtros por Estatísticas
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* PAC */}
            <div>
              <label className={`block text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                PAC
              </label>
              <div className="flex gap-1">
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={statsFilter.pac.min}
                  onChange={(e) => setStatsFilter(prev => ({ 
                    ...prev, 
                    pac: { ...prev.pac, min: parseInt(e.target.value) || 0 } 
                  }))}
                  placeholder="Min"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={`w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-green-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    theme === 'dark' 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                />
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={statsFilter.pac.max}
                  onChange={(e) => setStatsFilter(prev => ({ 
                    ...prev, 
                    pac: { ...prev.pac, max: parseInt(e.target.value) || 99 } 
                  }))}
                  placeholder="Max"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={`w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-green-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    theme === 'dark' 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            {/* SHO */}
            <div>
              <label className={`block text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                SHO
              </label>
              <div className="flex gap-1">
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={statsFilter.sho.min}
                  onChange={(e) => setStatsFilter(prev => ({ 
                    ...prev, 
                    sho: { ...prev.sho, min: parseInt(e.target.value) || 0 } 
                  }))}
                  placeholder="Min"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={`w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-green-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    theme === 'dark' 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                />
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={statsFilter.sho.max}
                  onChange={(e) => setStatsFilter(prev => ({ 
                    ...prev, 
                    sho: { ...prev.sho, max: parseInt(e.target.value) || 99 } 
                  }))}
                  placeholder="Max"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={`w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-green-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    theme === 'dark' 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            {/* PAS */}
            <div>
              <label className={`block text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                PAS
              </label>
              <div className="flex gap-1">
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={statsFilter.pas.min}
                  onChange={(e) => setStatsFilter(prev => ({ 
                    ...prev, 
                    pas: { ...prev.pas, min: parseInt(e.target.value) || 0 } 
                  }))}
                  placeholder="Min"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={`w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-green-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    theme === 'dark' 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                />
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={statsFilter.pas.max}
                  onChange={(e) => setStatsFilter(prev => ({ 
                    ...prev, 
                    pas: { ...prev.pas, max: parseInt(e.target.value) || 99 } 
                  }))}
                  placeholder="Max"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={`w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-green-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    theme === 'dark' 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            {/* DRI */}
            <div>
              <label className={`block text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                DRI
              </label>
              <div className="flex gap-1">
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={statsFilter.dri.min}
                  onChange={(e) => setStatsFilter(prev => ({ 
                    ...prev, 
                    dri: { ...prev.dri, min: parseInt(e.target.value) || 0 } 
                  }))}
                  placeholder="Min"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={`w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-green-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    theme === 'dark' 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                />
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={statsFilter.dri.max}
                  onChange={(e) => setStatsFilter(prev => ({ 
                    ...prev, 
                    dri: { ...prev.dri, max: parseInt(e.target.value) || 99 } 
                  }))}
                  placeholder="Max"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={`w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-green-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    theme === 'dark' 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            {/* DEF */}
            <div>
              <label className={`block text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                DEF
              </label>
              <div className="flex gap-1">
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={statsFilter.def.min}
                  onChange={(e) => setStatsFilter(prev => ({ 
                    ...prev, 
                    def: { ...prev.def, min: parseInt(e.target.value) || 0 } 
                  }))}
                  placeholder="Min"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={`w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-green-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    theme === 'dark' 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                />
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={statsFilter.def.max}
                  onChange={(e) => setStatsFilter(prev => ({ 
                    ...prev, 
                    def: { ...prev.def, max: parseInt(e.target.value) || 99 } 
                  }))}
                  placeholder="Max"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={`w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-green-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    theme === 'dark' 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            {/* PHY */}
            <div>
              <label className={`block text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                PHY
              </label>
              <div className="flex gap-1">
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={statsFilter.phy.min}
                  onChange={(e) => setStatsFilter(prev => ({ 
                    ...prev, 
                    phy: { ...prev.phy, min: parseInt(e.target.value) || 0 } 
                  }))}
                  placeholder="Min"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={`w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-green-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    theme === 'dark' 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                />
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={statsFilter.phy.max}
                  onChange={(e) => setStatsFilter(prev => ({ 
                    ...prev, 
                    phy: { ...prev.phy, max: parseInt(e.target.value) || 99 } 
                  }))}
                  placeholder="Max"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={`w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-green-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    theme === 'dark' 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          Mostrando {displayedPlayers.length} de {availablePlayers.length} jogadores disponíveis
        </div>

        {/* Observation Box */}
        <div className={`p-3 border rounded-lg ${
          theme === 'dark' 
            ? 'bg-blue-900 border-blue-700' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className={`flex items-center ${
            theme === 'dark' ? 'text-blue-200' : 'text-blue-800'
          }`}>
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">
              As estatísticas de cada jogador sofrerá atualizações no FC26
            </span>
          </div>
        </div>
      </div>

      {/* Turn Status */}
      {isDisabled && (
        <div className={`mb-4 p-3 border rounded-lg ${
          theme === 'dark' ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className={`flex items-center justify-center ${
            theme === 'dark' ? 'text-yellow-200' : 'text-yellow-800'
          }`}>
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

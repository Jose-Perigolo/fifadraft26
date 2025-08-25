import { NextResponse } from 'next/server';
import Papa from 'papaparse';
import { Player } from '@/types';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const csvPath = path.join(process.cwd(), 'src/playerbase/male_players.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    const { data } = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
    });

    const players: Player[] = data.map((row: unknown, index: number) => {
      const rowData = row as Record<string, string>;
      return {
      id: index,
      name: rowData.Name || '',
      overall: parseInt(rowData.OVR) || 0,
      position: rowData.Position || '',
      age: parseInt(rowData.Age) || 0,
      nation: rowData.Nation || '',
      league: rowData.League || '',
      team: rowData.Team || '',
      pace: parseInt(rowData.PAC) || 0,
      shooting: parseInt(rowData.SHO) || 0,
      passing: parseInt(rowData.PAS) || 0,
      dribbling: parseInt(rowData.DRI) || 0,
      defending: parseInt(rowData.DEF) || 0,
      physical: parseInt(rowData.PHY) || 0,
      height: rowData.Height || '',
      weight: rowData.Weight || '',
      weakFoot: parseInt(rowData['Weak foot']) || 0,
      skillMoves: parseInt(rowData['Skill moves']) || 0,
      preferredFoot: rowData['Preferred foot'] || '',
      playStyle: rowData['play style'] || '',
      url: rowData.url || '',
    };
    });

    // Filter out players with missing essential data
    const validPlayers = players.filter(player => 
      player.name && 
      player.overall > 0 && 
      player.position
    );

    return NextResponse.json({ 
      players: validPlayers,
      total: validPlayers.length 
    });
  } catch (error) {
    console.error('Error loading players:', error);
    return NextResponse.json(
      { error: 'Failed to load players' },
      { status: 500 }
    );
  }
}

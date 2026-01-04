import React from 'react';
import Grid from '@mui/material/Grid';
import { Card, CardContent, Typography, Box } from '@mui/material';
import GridComponent from '../../../components/GridComponent';
import { CassettePlayer } from '../../../components/NostagiaComponent/CassettePlayer';
import { VinylRecord } from '../../../components/NostagiaComponent/VinylRecord';


// --- Data ---
// We need 16 items to create the grid.


// --- Component ---
function App() {
  return (
    <div className='bg-white min-h-screen p-8'>
      {/* <div className="mb-12">
        <Typography variant="h4" className="text-center font-black text-slate-800 mb-8 tracking-tighter italic">
          NOSTALGIC AUDIO CORNER
        </Typography>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          <CassettePlayer />
          <VinylRecord />
        </div>
      </div> */}
      <GridComponent />

    </div>
  );
}

export default App;

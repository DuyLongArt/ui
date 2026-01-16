import Box from '@mui/material/Box';
import './App.css'
// import './index.css'
// import HomePage from "./UILayer/pages/Home/HomePage";
import { BrowserRouter } from 'react-router-dom';
import AppRouterLayer from './RouterLayer/AppRouterLayer';
import SecurityLayer from './SecurityLayer/SecurityLayer';
import LocalDataLayer from './DataLayer/LocalDataLayer/LocalDataLayer';
import OrchestraLayer from './OrchestraLayer/OrchestraLayer';



const App: React.FC = () => {
  return (
    <div className="h-full w-full">

      <BrowserRouter>
        <LocalDataLayer>


          <OrchestraLayer >











            <SecurityLayer>
              <AppRouterLayer />
            </SecurityLayer>






          </OrchestraLayer>

        </LocalDataLayer>
      </BrowserRouter>


    </div>
  )
}
export default App

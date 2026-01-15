import React from 'react';
import ResponsiveAppBar from '../../components/ResponsiveAppbar.tsx';
import type { ChildrenInterface } from '../../../OrchestraLayer/ChildrenComponent.tsx';

import { Outlet, useLocation } from 'react-router-dom';
import OrchestraButton from '../../components/OrchestraButton.tsx';
import CustomDrawer from '../../components/CustomDrawer.tsx';
import { orchestraButton } from '../../../OrchestraLayer/StateManager/XState/OrchestraButton.tsx';
import { useMachine } from '@xstate/react';
// import AvatarFloatButton from '../../components/AvatarFloatButton.tsx';
import backgroundImage from '@assets/backgroundentry.png';


const EntryLayout: React.FC<ChildrenInterface> = ({ children }) => {
  const [state, send] = useMachine(orchestraButton);

  return (
    <div
      className="min-h-screen w-screen relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-0" />
      <div className="flex-1 w-full h-screen overflow-auto relative z-10">

        <Outlet />
        {children}


      </div>



    </div>
  );
};

export default EntryLayout;
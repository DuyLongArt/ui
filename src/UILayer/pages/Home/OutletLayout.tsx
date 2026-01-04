import React from 'react';
import ResponsiveAppBar from '../../components/ResponsiveAppbar';
import type { ChildrenInterface } from '../../../OrchestraLayer/ChildrenComponent';

import { Outlet, useLocation } from 'react-router-dom';
import OrchestraButton from '../../components/OrchestraButton.tsx';
import CustomDrawer from '../../components/CustomDrawer';
import { orchestraButton } from '../../../OrchestraLayer/StateManager/XState/OrchestraButton';
import { useMachine } from '@xstate/react';
// import AvatarFloatButton from '../../components/AvatarFloatButton.tsx';


const OutletLayout: React.FC<ChildrenInterface> = ({ children }) => {
  const [state, send] = useMachine(orchestraButton);

  return (
    <div className="border-4  border-blue-500 min-h-screen  w-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Header Section */}
      <div className="">
        <OrchestraButton onClick={() => send({ type: 'CLICK' })} />

      </div>


      <div>
        <CustomDrawer
          isOpen={state.matches("onButtonOpen")}
          onClose={() => send({ type: 'CLOSE' })}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full h-screen overflow-auto">

        <Outlet />
        {children}


      </div>

      {/* <AvatarFloatButton x={100} y={80} sizeScale={1.5} collaboratorDistance={100} /> */}

    </div>
  );
};

export default OutletLayout;
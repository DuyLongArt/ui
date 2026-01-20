import React, { useEffect, useRef, useState } from 'react';
import ResponsiveAppBar from '../../components/ResponsiveAppbar';
import type { ChildrenInterface } from '../../../OrchestraLayer/ChildrenComponent';
import { appRoutes } from '../../../RouterLayer/RouterConfig.tsx';
import { Outlet } from 'react-router-dom';
import OrchestraButton from '../../components/OrchestraButton.tsx';
import CustomDrawer from '../../components/CustomDrawer';
import { orchestraButton } from '../../../OrchestraLayer/StateManager/XState/OrchestraButton';
import { useMachine } from '@xstate/react';
import AvatarFloatButton from '../../components/AvatarFloatButton.tsx';
import Draggable from 'react-draggable';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import { usePersonInformationQuery, useInformationDetailsQuery, useUserAccountQuery, useUserSkillsQuery } from '../../../DataLayer/APILayer/userQueries';
import { useTruenasPoolsQuery, useTailscaleDevicesQuery } from '../../../DataLayer/APILayer/infrastructureQueries';
import { useUserAccountStore, useUserProfileStore, useUserSkillStore } from '../../../OrchestraLayer/StateManager/Zustand/userProfileStore.ts';
import { useTruenasStorageStore } from '../../../OrchestraLayer/StateManager/Zustand/truenasStorageStore';
import { useTailScaleStore } from '../../../OrchestraLayer/StateManager/Zustand/tailscaleStore';
import MainButton from '../../components/MainButton.tsx';

const HomeLayout: React.FC<ChildrenInterface> = ({ children }) => {
  const [state, send] = useMachine(orchestraButton);

  const userStore = useUserAccountStore();
  const nodeRef = useRef<HTMLDivElement>(null);

  // TanStack Query: Fetch Data
  const { data: personInfo } = usePersonInformationQuery();
  const { data: detailsInfo } = useInformationDetailsQuery();
  const { data: accountInfo } = useUserAccountQuery();
  const { data: skillsInfo } = useUserSkillsQuery();

  const { data: poolsInfo } = useTruenasPoolsQuery();
  const { data: devicesInfo } = useTailscaleDevicesQuery();

  // Sync Person Information to Zustand
  useEffect(() => {
    if (personInfo) {
      useUserProfileStore.setState((state) => ({
        information: {
          ...state.information,
          profiles: {
            ...state.information.profiles,
            id: personInfo.id,
            firstName: personInfo.firstName,
            lastName: personInfo.lastName,
            profileImageUrl: personInfo.profileImageUrl || state.information.profiles.profileImageUrl,
            alias: personInfo.alias,
          },
        },
      }));
    }
  }, [personInfo]);

  // Sync Details to Zustand
  useEffect(() => {
    if (detailsInfo) {
      useUserProfileStore.setState((state) => ({
        information: {
          ...state.information,
          details: {
            ...state.information.details,
            identity_id: detailsInfo.id,
            github_url: detailsInfo.github_url,
            website_url: detailsInfo.website_url,
            company: detailsInfo.company,
            university: detailsInfo.university,
            location: detailsInfo.location,
            country: detailsInfo.country,
            bio: detailsInfo.bio,
            occupation: detailsInfo.occupation,
            education_level: detailsInfo.education_level,
            linkedin_url: detailsInfo.linkedin_url,
          },
        },
      }));
    }
  }, [detailsInfo]);

  // Sync Account to Zustand
  useEffect(() => {
    if (accountInfo) {
      useUserAccountStore.setState((state) => ({
        ...state,
        account: {
          ...state.account,
          role: accountInfo.role,
          ip: accountInfo.deviceIP,
        },
      }));
    }
  }, [accountInfo]);

  // Sync Skills to Zustand
  useEffect(() => {
    if (skillsInfo) {
      useUserSkillStore.setState((state) => ({
        ...state,
        value: skillsInfo,
      }));
    }
  }, [skillsInfo]);

  // Sync TrueNAS Pools to Zustand
  useEffect(() => {
    if (poolsInfo) {
      useTruenasStorageStore.setState({ pools: poolsInfo });
      useTruenasStorageStore.getState().setPercentage(); // Update calculated percentages
    }
  }, [poolsInfo]);

  // Sync Tailscale Devices to Zustand
  useEffect(() => {
    if (devicesInfo) {
      useTailScaleStore.setState({ devices: devicesInfo, isLoading: false, error: null });
    }
  }, [devicesInfo]);

  // Dynamically filter navigation items based on user role and route permissions
  const filterRoutes = appRoutes.filter(route => {
    // Only consider domain routes for top-nav
    if (route.type !== 'domain' || route.path.includes("admin")) return false;

    // Skip login/register/entry related routes
    if (['login', 'register', 'entry'].some(p => route.path.includes(p))) return false;

    // Check permissions
    if (route.allowedRoles && route.allowedRoles.length > 0) {
      return route.allowedRoles.includes(userStore.account.role);
    }

    return true;
  });

  const filterPageList = filterRoutes.map(r => r.title || r.path);
  const filterPathList = filterRoutes.map(r => r.path);


  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDrag = (_e: DraggableEvent, ui: DraggableData) => {
    setPosition(prev => ({ x: prev.x + ui.deltaX, y: prev.y + ui.deltaY }));
  };
  useEffect(() => {
    // useUserProfileStore.getState().fetchFromDatabase(); // Removed in favor of TanStack Query
    const savedPos = localStorage.getItem('avatar-pos');
    if (savedPos) {
      const parsed = JSON.parse(savedPos);
      setPosition({ x: parsed.x, y: parsed.y });
    }
  }, []);

  return (
    <div className="flex flex-col h-full h-screen bg-indigo-200 w-full overflow-x-hidden relative">

      {/* Header Section (Fixed height / shrinking) */}
      <div className="flex w-full flex-row items-center justify-start z-100 backdrop-blur-sm sticky top-0">
        <div className="hidden md:block">
          <OrchestraButton onClick={() => send({ type: 'CLICK' })} />
        </div>
        <div className="flex-1">
          <ResponsiveAppBar
            pageList={filterPageList}
            pathList={filterPathList}
            onOpenDrawer={() => send({ type: 'CLICK' })}
          />
        </div>
      </div>

      {/* Drawer Section */}
      <CustomDrawer
        isOpen={state.matches("onButtonOpen")}
        onClose={() => send({ type: 'CLOSE' })}
      />

      {/* Main Content Area (Grows to fill space, scrolls internally) */}
      <div className="flex-1 bg-indigo-200! z-20">
        {children}
        <Outlet />

      </div>

      {/* 4. DRAGGABLE FIX: 
          - nodeRef is passed to both <Draggable> and the child <div> 
          - Positioned 'absolute' with high z-index to float over everything
      */}
      <Draggable
        nodeRef={nodeRef}
        position={position}
        onDrag={handleDrag}
        bounds="parent" // Optional: Prevents dragging off-screen

        // nodeRef={nodeRef}
        defaultPosition={{ x: localStorage.getItem('avatar-pos') ? JSON.parse(localStorage.getItem('avatar-pos')!).x : 0, y: localStorage.getItem('avatar-pos') ? JSON.parse(localStorage.getItem('avatar-pos')!).y : 0 }}
        onStop={(_e, data) => {
          localStorage.setItem('avatar-pos', JSON.stringify({ x: data.x, y: data.y }));
        }}
      >
        <div
          ref={nodeRef}
          className="absolute bottom-4 right-4 md:bottom-10 md:right-10 origin-bottom-right scale-75 md:scale-100 z-1000 cursor-move touch-none"
        // nodeRef={nodeRef}
        // defaultPosition={{ x: savedX, y: savedY }}

        >
          <AvatarFloatButton
            x={0}
            y={0} // Internal coords can be 0 since Draggable handles the div
            sizeScale={1.5}
            collaboratorDistance={100}
          />
        </div>
      </Draggable>




    </div>
  );
};

export default HomeLayout;
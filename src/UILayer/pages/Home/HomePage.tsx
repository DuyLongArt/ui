import type { ChildrenInterface } from '../../../OrchestraLayer/ChildrenComponent';
import React, { useEffect } from "react";
import { ReflectHero } from "./Reflect/ReflectHero";
import DashboardPage from './Dashboard/DashboardPage';
import { useUserAccountStore } from '../../../OrchestraLayer/StateManager/Zustand/userProfileStore';

const HomePage: React.FC<ChildrenInterface> = ({ children }) => {
  // const { getUserRole } = useUserAccountStore();
  // useEffect(() => {
  //   getUserRole();
  // }, []);
  return (
    <div className="w-full h-full relative overflow-y-auto overflow-x-hidden">
      {/* <ReflectHero /> */}
      <DashboardPage />
      <div className="relative z-30">
        {children}
      </div>
    </div>
  );
}
export default HomePage;
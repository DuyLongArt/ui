import type { ChildrenInterface } from '../../../OrchestraLayer/ChildrenComponent';
import React from "react";
import DashboardPage from "./Dashboard/DashboardPage";

const HomePage: React.FC<ChildrenInterface> = ({ children }) => {
  return (
    <div className="w-full h-full relative overflow-y-auto overflow-x-hidden">
      {/* Background blobs or effects can go here if needed, but Dashboard has its own container */}
      <DashboardPage />
      {children}
    </div>
  );
}
export default HomePage;
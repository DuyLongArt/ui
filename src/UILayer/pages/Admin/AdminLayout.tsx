import { Outlet } from "react-router-dom";
import { AuthenticateFactor } from "../../../OrchestraLayer/StateManager/XState/AuthenticateMachine";

const AdminLayout: React.FC = () => {
  const actorRef = AuthenticateFactor.useActorRef();

  const handleLogout = () => {
    console.log("Logout clicked in Admin Console");
    actorRef.send({ type: 'LOGOUT' });
  };

  return (
    <div>
      <nav className="flex justify-between items-center p-4 bg-gray-100 border-b border-gray-200">
        <span className="font-bold text-gray-700">Admin Console</span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded shadow-sm transition-colors"
        >
          Logout
        </button>
      </nav>
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
};
export default AdminLayout;
import React from "react";
import { Inbox, Mail, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
interface DrawerProps {
    isOpen: boolean;
    onClose: (isOpen: boolean) => void;
}

const CustomDrawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const handleClose = () => {
        onClose(false);
    };
    const goHome = () => {
        if (window.location.pathname != "/home/index") {
            navigate("/home/index")
            onClose(false);
        } else {
            onClose(false);
        }
    }
    const go = (target: string) => {
        navigate("/" + target)
        onClose(false);
    }
    return (
        <>
            {/* Backdrop/Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-indigo-500/50 z-40 backdrop-blur-sm"
                    onClick={handleClose}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed left-0 top-0 h-full w-50 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? "translate-x-0" : "-translate-x-full "
                    }`}
            >
                {/* Drawer Content */}
                <div className="p-4">
                    {/* Close Button */}
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={handleClose}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Close drawer"
                        >
                            <X size={20} className="text-white" />
                        </button>
                    </div>

                    {/* Menu Items */}
                    <nav>
                        <ul className="space-y-2">
                            <li>
                                <button
                                    onClick={goHome}
                                    className="w-full flex items-center p-3 text-left hover:bg-gray-100 rounded-lg transition-colors group"
                                >
                                    <div className="flex items-center justify-center w-10 h-10 mr-3">
                                        <Inbox
                                            size={20}
                                            className="text-white group-hover:text-gray-800"
                                        />
                                    </div>
                                    <span className="text-white font-medium">Home</span>
                                </button>
                            </li>


                            <li>
                                <button
                                    onClick={() => go("login/register")}
                                    className="w-full flex items-center p-3 text-left hover:bg-gray-100 rounded-lg transition-colors group"
                                >
                                    <div className="flex items-center justify-center w-10 h-10 mr-3">
                                        <Inbox
                                            size={20}
                                            className="text-white group-hover:text-gray-800"
                                        />
                                    </div>
                                    <span className="text-white font-medium">Register</span>
                                </button>
                            </li>

                            <li>
                                <button
                                    onClick={() => go("entry/index")}
                                    className="w-full flex items-center p-3 text-left hover:bg-gray-100 rounded-lg transition-colors group"
                                >
                                    <div className="flex items-center justify-center w-10 h-10 mr-3">
                                        <Mail
                                            size={20}
                                            className="text-white group-hover:text-gray-800"
                                        />
                                    </div>
                                    <span className="text-white font-medium">Entry</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default CustomDrawer;
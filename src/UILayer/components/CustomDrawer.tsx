import React, { useEffect } from "react";
import { Inbox, Mail, Snowflake, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
interface DrawerProps {
    isOpen: boolean;
    onClose: (isOpen: boolean) => void;
}

const CustomDrawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const handleClose = () => {
        onClose(false);
    };
    // Close drawer on Escape key press
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                handleClose();
            }
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [isOpen]);
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
            {/* Backdrop/Overlay with glassmorphism */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                    onClick={handleClose}
                    aria-hidden="true"
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed left-0 top-0 h-full w-64 bg-white/70 backdrop-filter backdrop-blur-lg shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="drawer-title"
            >
                {/* Drawer Content */}
                <div className="flex flex-col h-full overflow-y-auto">
                    {/* Header */}
                    <div className="p-6 flex items-center justify-between border-b border-gray-200/50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
                                <Inbox size={18} className="text-white" />
                            </div>
                            <div>
                                <h2 id="drawer-title" className="text-lg font-bold text-gray-900 tracking-tight">
                                    Navigation
                                </h2>
                                <p className="text-xs text-gray-500 font-medium">Main Menu</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
                            aria-label="Close drawer"
                        >
                            <X size={20} className="text-gray-400 group-hover:text-gray-600 group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>

                    <div className="p-4 grow">
                        <nav>
                            <ul className="space-y-1.5">
                                <li>
                                    <button
                                        onClick={goHome}
                                        className={`w-full flex items-center p-3 text-left rounded-xl transition-all duration-200 group relative overflow-hidden ${location.pathname === "/home/index"
                                            ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                            }`}
                                    >
                                        {location.pathname === "/home/index" && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full" />
                                        )}
                                        <div className={`flex items-center justify-center w-10 h-10 mr-3 rounded-lg transition-colors ${location.pathname === "/home/index" ? "bg-indigo-100" : "bg-gray-100 group-hover:bg-gray-200"
                                            }`}>
                                            <Inbox size={20} className={location.pathname === "/home/index" ? "text-indigo-600" : "text-gray-500 group-hover:text-gray-700"} />
                                        </div>
                                        <span className="font-semibold text-sm tracking-wide">Home</span>
                                    </button>
                                </li>

                                <li>
                                    <button
                                        onClick={() => go("login/register")}
                                        className={`w-full flex items-center p-3 text-left rounded-xl transition-all duration-200 group relative overflow-hidden ${location.pathname.includes("login/register")
                                            ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                            }`}
                                    >
                                        {location.pathname.includes("login/register") && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full" />
                                        )}
                                        <div className={`flex items-center justify-center w-10 h-10 mr-3 rounded-lg transition-colors ${location.pathname.includes("login/register") ? "bg-indigo-100" : "bg-gray-100 group-hover:bg-gray-200"
                                            }`}>
                                            <Inbox size={20} className={location.pathname.includes("login/register") ? "text-indigo-600" : "text-gray-500 group-hover:text-gray-700"} />
                                        </div>
                                        <span className="font-semibold text-sm tracking-wide">Register</span>
                                    </button>
                                </li>

                                <li>
                                    <button
                                        onClick={() => go("entry/index")}
                                        className={`w-full flex items-center p-3 text-left rounded-xl transition-all duration-200 group relative overflow-hidden ${location.pathname.includes("entry/index")
                                            ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                            }`}
                                    >
                                        {location.pathname.includes("entry/index") && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full" />
                                        )}
                                        <div className={`flex items-center justify-center w-10 h-10 mr-3 rounded-lg transition-colors ${location.pathname.includes("entry/index") ? "bg-indigo-100" : "bg-gray-100 group-hover:bg-gray-200"
                                            }`}>
                                            <Mail size={20} className={location.pathname.includes("entry/index") ? "text-indigo-600" : "text-gray-500 group-hover:text-gray-700"} />
                                        </div>
                                        <span className="font-semibold text-sm tracking-wide">Entry</span>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* Footer / User Info could go here */}
                    <div className="p-4 border-t border-gray-200/50">
                        <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-100">
                                <Snowflake size={20} className="text-white" />
                            </div>
                            <div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CustomDrawer;
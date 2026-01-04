import React, { useState, useEffect, useMemo } from "react";
import {
  Navbar,
  Typography,
  IconButton,
  Collapse,
} from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import PersonProfileIcon from "./PersonProfileIcon";

interface ResponsiveListProps {
  pageList: string[];
  pathList: string[];
}

const commonProps = {
  placeholder: undefined,
  onPointerEnterCapture: undefined,
  onPointerLeaveCapture: undefined,
  onResize: undefined,
  onResizeCapture: undefined,
} as any;

const ResponsiveAppBar: React.FC<ResponsiveListProps> = ({ pageList, pathList }) => {
  const [openNav, setOpenNav] = useState(false);
  const navigate = useNavigate();

  const navigationItems = useMemo(() => {
    return pageList
      .map((name, index) => ({ name, path: pathList[index] }))
      .filter(item => item.name !== "Index");
  }, [pageList, pathList]);

  useEffect(() => {
    const handleResize = () => window.innerWidth >= 960 && setOpenNav(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigation = (path: string) => {
    const formattedPath = path.toLowerCase().replace(/\s+/g, '-');
    navigate(`/${formattedPath}`);
    setOpenNav(false);
  };

  const NavList = ({ mobile = false }: { mobile?: boolean }) => (
    <ul className={`flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6 ${mobile ? "mt-4 mb-4" : ""}`}>
      {navigationItems.map(({ name, path }) => (
        <Typography
          key={name}
          as="li"
          variant="small"
          className="font-bold text-lg"
          {...commonProps}
        >
          <div
            onClick={() => handleNavigation(path)}
            className={`cursor-pointer rounded-lg px-4 py-2 transition-all duration-300
              ${mobile
                ? "text-white hover:bg-white/10 hover:shadow-lg border border-transparent hover:border-white/10"
                : "text-white/90 hover:text-white hover:bg-white/10 hover:shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:backdrop-blur-sm border border-transparent hover:border-white/20"}`}
          >
            {name}
          </div>
        </Typography>
      ))}
    </ul>
  );

  return (
    <div className="w-full ">
      <Navbar
        fullWidth
        className="sticky top-0 z-50 h-max max-w-full  px-2 py-2 lg:px-8 border-b border-white/40 rounded-2xl bg-indigo-500/70 backdrop-blur-md shadow-lg"
        {...commonProps}
      >
        <div className="flex items-center justify-between w-full">

          {/* Logo with slight text shadow for better contrast against glass */}
          <Typography
            as="div"
            onClick={() => navigate("/home/index")}
            className="cursor-pointer py-1.5 font-bold text-xl lg:text-2xl text-white hover:text-indigo-200 transition-colors drop-shadow-sm"
            style={{ fontFamily: 'serif' }}
            {...commonProps}
          >
            ICE SITE
          </Typography>

          <div className="hidden lg:block">
            <NavList />
          </div>

          <div className="flex items-center gap-4">
            <div className="hover:opacity-80 transition-opacity cursor-pointer p-1 rounded-full hover:bg-white/10">
              <PersonProfileIcon onClick={() => navigate("/admin/person-profile")} />
            </div>

            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 text-white hover:bg-white/10 focus:bg-white/10 active:bg-white/10 lg:hidden rounded-full"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
              {...commonProps}
            >
              {openNav ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </div>
        </div>

        <Collapse open={openNav}>
          {/* Mobile menu separator - light semi-transparent line */}
          <div className="border-t border-white/20 mt-2">
            <NavList mobile />
          </div>
        </Collapse>
      </Navbar>
    </div>
  );
};

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default ResponsiveAppBar;
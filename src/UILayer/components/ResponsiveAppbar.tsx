import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Navbar,
  Typography,
  IconButton,
  Collapse,
} from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import PersonProfileIcon from "./PersonProfileIcon";
import { useMusicStore } from "../../OrchestraLayer/StateManager/Zustand/musicStore";
import { Play, Pause, SkipForward, Square, Music as MusicIcon, SkipBack, Headphones, HeartCrackIcon, DiamondMinus } from "lucide-react";
import { MusicList, type MusicListProps } from "../pages/Home/Music/MusicList";

interface ResponsiveListProps {
  pageList: string[];
  pathList: string[];
  onOpenDrawer?: () => void;
}

const commonProps = {
  placeholder: undefined,
  onPointerEnterCapture: undefined,
  onPointerLeaveCapture: undefined,
  onResize: undefined,
  onResizeCapture: undefined,
} as any;

const ResponsiveAppBar: React.FC<ResponsiveListProps> = ({ pageList, pathList, onOpenDrawer }) => {
  const [openNav, setOpenNav] = useState(false);
  const navigate = useNavigate();
  const { currentSong, isPlaying, playlist, setIsPlaying, playNext, setCurrentSong, playPrev, fetchPlaylist } = useMusicStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [openMusicList, setOpenMusicList] = useState(false);

  // Global Audio Logic
  useEffect(() => {

    //  useEffect(() => {
    fetchPlaylist();
    // }, []);
    if (currentSong && audioRef.current) {
      if (audioRef.current.src !== currentSong.url) {
        audioRef.current.src = currentSong.url;
      }
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("AppBar Play error:", e));
      } else {
        audioRef.current.pause();
      }
    } else if (!currentSong && audioRef.current) {
      audioRef.current.pause();
    }
  }, [currentSong, isPlaying]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };
  const openMusicListAction = () => {
    console.log("Toggling music list. Previous state:", openMusicList);
    setOpenMusicList(!openMusicList);
  }
  const navigationItems = useMemo(() => {
    if (!Array.isArray(pageList)) return [];
    return pageList
      .map((name, index) => ({ name, path: (pathList && pathList[index]) || '' }))
      .filter(item => item.name !== "Index");
  }, [pageList, pathList]);

  useEffect(() => {
    const handleResize = () => window.innerWidth >= 960 && setOpenNav(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigation = (path: string) => {
    const formattedPath = path.toLowerCase().replace(/\s+/g, '-');
    navigate(`/${formattedPath}/index`);
    setOpenNav(false);
  };

  const musicListElement = Array.isArray(playlist) ? playlist.map(element => {
    return {
      title: element.title,
      url: element.url
    }
  }) : [];

  const [navName, setNavName] = useState<string>('');
  // const [match, setMatch] = useState<boolean>(false);
  // useEffect(() => {
  //   // const formattedPath = window.location.pathname.toLowerCase().replace(/\s+/g, '-');
  //   // const matchedItem = navigationItems.find(item => item.path === formattedPath);
  //   console.log("NavName:", navName);
  //   console.log("Path:", window.location.pathname);
  //   if (window.location.pathname.includes(navName.toLowerCase())) {
  //     console.log("Matched!");
  //     setMatch(true);
  //   }

  // }, [window.location.pathname, navigationItems]);

  const NavList = ({ mobile = false }: { mobile?: boolean }) => (

    <ul className={`flex flex-col gap-2 lg:mb-0  lg:mt-0 lg:flex-row lg:items-center lg:gap-6 ${mobile ? "mt-4 mb-4" : ""}`}>
      {mobile && onOpenDrawer && (
        <div className="font-bold text-lg">
          <div
            onClick={() => { onOpenDrawer(); setOpenNav(false); }}
            className="cursor-pointer rounded-lg px-4 py-2 transition-all duration-300 text-indigo-100 hover:bg-white/10 flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            Main Menu
          </div>
        </div>
      )}
      {navigationItems.map(({ name, path }) => (
        <div
          key={name}
          as="li"
          variant="small"
          className="font-bold text-lg"
          {...commonProps}
        >
          <div
            onClick={() => {
              handleNavigation(path);
              setNavName(path);
              // console.log("NavName:", navName);
              // console.log("Name:", name); 
              console.log("Navigation to:", path);

            }
            }
            className={`cursor-pointer rounded-lg px-4 py-2 transition-all duration-300 ${window.location.pathname.includes(path) ? "text-white! bg-indigo-400!" : ""} 
              ${mobile
                ? " hover:bg-white/10 hover:shadow-lg border border-transparent hover:border-white/10"
                : " hover:bg-white/10 hover:shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:backdrop-blur-sm border border-transparent hover:border-white/20"}`}
          >
            {name}
          </div>
        </div>
      ))}
    </ul>
  );

  return (
    <div className="w-full phone:border-2 phone:border-red-700   sticky top-0 z-100  py-1 ">
      {/* Custom Appbar Body - Replacing restrictive library Navbar */}
      <div className="h-max    md:px-2 lg:px-4 sm:px-4 sm:w-full max-[600px]:w-screen! max-[410px]:rounded-xl  md:w-full lg:w-full px-1  py-2 md:rounded-xl lg:rounded-xl phone:border-2 phone:border-red-700 sm:rounded-2xl bg-indigo-600/60 backdrop-blur-md shadow-lg border border-white/20 flex flex-col transition-all duration-300 ">

        <div className="flex items-center min-[410px]:justify-between w-full  h-10 sm:h-12 flex-nowrap gap-1">

          {/* Logo Section */}
          <div className="flex items-center shrink max-[410px]:text-sm max-[410px]:ml-1 floating-text lg:pr-2 md:pr-2 phone:pr-1">
            <p
              onClick={() => navigate("/home/index")}
              className="cursor-pointer font-bold text-shadow-lg text-md text-stroke items-center mt-1 xs:text-base sm:text-2xl hover:text-[#291067] text-border md:text-2xl lg:text-2xl text-indigo-200 transition-all truncate"
              style={{ fontFamily: 'serif' }}
            >
              ICE SITE
            </p>
          </div>

          {/* Desktop Nav */}
          <div className="hidden max-[1020px]:hidden! md:flex border  border-white/10 bg-indigo-500/60 rounded-2xl items-center ml-auto">
            <NavList />
          </div>

          {/* Mini Player Section - Restored to previous UI */}


          {/* Action Section (Profile and Hamburger) */}
          <div className="flex items-center gap-0.5  ml-auto" >
            {currentSong && (
              <div className="items-center   md:flex lg:flex    justify-center">
                <div
                  onClick={openMusicListAction}
                  className=" md:flex items-center gap-3 shrink-0   w-fit bg-black/20 backdrop-blur-md rounded-full min-[410px]:px-4 py-1.5 phone:mr-1 md:mr-4 lg:mr-4 border border-white/10 hover:bg-black/30 transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 max-[780px]:hidden rounded-full overflow-hidden relative">
                    <div className={`w-full h-full bg-indigo-500   flex items-center justify-center`} onDoubleClick={() => { navigate('/utilities/index/music') }}>
                      <MusicIcon size={14} className="text-white" />
                    </div>
                  </div>
                  <div className="flex flex-col max-[780px]:hidden max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[150px]">
                    <span className="text-xs text-white font-bold truncate">{currentSong.title}</span>
                    <span className="text-[10px] text-white truncate">{currentSong.artist || 'Unknown'}</span>
                  </div>




                  <div className="flex items-center  min-[410px]:gap-2 min-[410px]:mr-3">



                    <button
                      onClick={(e) => { e.stopPropagation(); playPrev(); }}
                      className="p-1 max-[410px]:hidden rounded-full hover:bg-white/20 text-white transition-colors"
                    >
                      <SkipBack size={16} fill="currentColor" />
                    </button>

                    <button onClick={togglePlay} className="p-1 max-[410px]:hidden rounded-full hover:bg-white/20 text-white transition-colors">
                      {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); playNext(); }}
                      className="p-1 max-[410px]:hidden rounded-full hover:bg-white/20 text-white transition-colors"
                    >
                      <SkipForward size={16} fill="currentColor" />
                    </button>



                    <div className="max-[410px]:px-2 flex max-[410px]:gap-1">

                      <button onClick={togglePlay} className="   min-[410px]:hidden rounded-full hover:bg-white/20 text-white transition-colors">
                        {isPlaying ? <Pause size={6} fill="currentColor" /> : <Play size={6} fill="currentColor" />}
                      </button>
                      <button
                        onClick={(e) => { openMusicListAction(); }}

                        className=" min-[410px]:hidden rounded-full hover:bg-white/20 text-white transition-colors "
                      >
                        <DiamondMinus size={6} fill="currentColor" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate('/utilities/index/music') }}
                        className=" min-[410px]:hidden rounded-full hover:bg-white/20 text-white transition-colors "
                      >
                        <MusicIcon size={6} fill="currentColor" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="cursor-pointer ">
              <PersonProfileIcon onClick={() => navigate("/admin/person-profile/index")} />
            </div>

            <div className="flex items-center  lg:hidden md:hidden shrink-0.25">
              <IconButton
                variant="text"
                className="h-9 w-9 text-white! hover:bg-white/10 rounded-full flex items-center justify-center p-0"
                ripple={false}
                onClick={() => setOpenNav(!openNav)}
                {...commonProps}
              >
                {openNav ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        <div className={` w-full    overflow-hidden transition-all duration-500 ease-in-out ${openNav ? 'max-h-[600px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
          <div className="w-full pb-4 px-1">
            <NavList mobile />

            {/* Mobile Mini Player - Restored to previous UI */}

          </div>
        </div>
      </div>

      {openMusicList && (
        <div className="absolute top-full right-0 z-200 w-full max-w-[320px] sm:hidden lg:block md:block p-2 mt-2">
          <ul className="bg-indigo-900/75 border border-white/20 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl max-h-[410px]">
            <div className="p-3 border-b border-white/10">
              <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">Playlist</span>
            </div>
            <div className="overflow-y-auto custom-scrollbar max-h-[410px]">
              {Array.isArray(playlist) && playlist.length > 0 ? (
                playlist.map((item, index) => (
                  <li
                    key={index}
                    className={`h-12 px-4 flex items-center hover:bg-white/10 transition-colors border-b border-white/5 last:border-0 cursor-pointer ${currentSong?.id === item.id ? 'bg-indigo-500/30' : ''}`}
                    onClick={() => {
                      setCurrentSong(item);
                      setOpenMusicList(false);
                    }}
                  >
                    <div className="flex flex-col min-w-0">
                      <span className={`text-sm truncate ${currentSong?.id === item.id ? 'text-indigo-200 font-bold' : 'text-white'}`}>
                        {item.title}
                      </span>
                      <span className="text-[10px] text-white truncate">{item.artist || 'Unknown Artist'}</span>
                    </div>
                    {currentSong?.id === item.id && isPlaying && (
                      <div className="ml-auto w-4 h-4 flex items-center justify-center">
                        <div className="flex gap-0.5 items-end h-3">
                          <span className="w-0.5 bg-indigo-400 animate-music-bar-1"></span>
                          <span className="w-0.5 bg-indigo-400 animate-music-bar-2"></span>
                          <span className="w-0.5 bg-indigo-400 animate-music-bar-3"></span>
                        </div>
                      </div>
                    )}
                  </li>
                ))
              ) : (
                <div className="p-8 text-center text-white text-sm italic">
                  No songs in playlist
                </div>
              )}
            </div>
          </ul>
        </div>
      )}

      {/* Global Audio Element */}
      <audio
        ref={audioRef}
        onEnded={playNext}
        onError={(e) => console.error("Audio playback error", e)}
      />
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
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
import { Play, Pause, SkipForward, Square, Music as MusicIcon } from "lucide-react";
import { MusicList, type MusicListProps } from "../pages/Home/Music/MusicList";

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
  const { currentSong, isPlaying, playlist, setIsPlaying, playNext, setCurrentSong } = useMusicStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [openMusicList, setOpenMusicList] = useState(false);

  // Global Audio Logic
  useEffect(() => {
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
    navigate(`/${formattedPath}`);
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

    <ul className={`flex flex-col gap-2  lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6 ${mobile ? "mt-4 mb-4" : ""}`}>
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
    <div className="w-full relative md:px-2 lg:px-2 py-2">
      <Navbar
        fullWidth
        className="sticky top-0 h-max max-w-full px-4 py-2 border border-white/40 rounded-2xl bg-linear-to-r from-indigo-500/90 via-indigo-500/90 to-indigo-600/80 backdrop-blur-md shadow-lg"
        {...commonProps}
      >
        <div className="flex items-center justify-between w-full">

          {/* Logo with slight text shadow for better contrast against glass */}
          <p
            onClick={() => navigate("/home/index")}
            className="cursor-pointer py-1.5 md:px-1 lg:px-2 font-bold text-shadow-great text-xl sm:text-2xl text-indigo-900 text-shadow-current mask-linear-from-neutral-950 lg:text-3xl hover:text-indigo-200 transition-colors drop-shadow-sm shrink-0"
            style={{ fontFamily: 'serif' }}
          >
            ICE SITE
          </p>

          <div className="hidden lg:block">
            <NavList />
          </div>

          {/* Mini Player */}
          {currentSong && (
            <div className="items-center justify-center">
              <div
                onClick={openMusicListAction}
                className="hidden md:flex items-center gap-3 bg-black/20 backdrop-blur-md rounded-full px-4 py-1.5 mr-4 border border-white/10 hover:bg-black/30 transition-all cursor-pointer group"
              >

                <div className="w-8 h-8 rounded-full overflow-hidden relative">

                  <div className={`w-full h-full bg-indigo-500 flex items-center justify-center`}>
                    <MusicIcon size={14} className="text-white" />
                  </div>

                </div>
                <div className="flex flex-col max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[150px]">
                  <span className="text-xs text-white font-bold truncate">{currentSong.title}</span>
                  <span className="text-[10px] text-white truncate">{currentSong.artist || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <button onClick={togglePlay} className="p-1 rounded-full hover:bg-white/20 text-white transition-colors">
                    {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); playNext(); }}
                    className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
                  >
                    <SkipForward size={16} fill="currentColor" />
                  </button>
                </div>

              </div>

            </div>
          )}


          <div className="flex items-center  md:gap-2 lg:gap-4">
            <div className="hover:opacity-80 transition-opacity cursor-pointer p-1 rounded-full hover:bg-white/10 shrink-0">
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
          <div className="container mx-auto pb-4">
            <NavList mobile />

            {/* Mobile Mini Player */}
            {currentSong && (
              <div

                className="mt-4 flex items-center justify-between bg-black/20 backdrop-blur-md rounded-xl p-3 border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
                    <MusicIcon size={20} className="text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-white font-bold">{currentSong.title}</span>
                    <span className="text-xs text-white">{currentSong.artist || 'Unknown'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={togglePlay} className="p-2 rounded-full bg-white/10 text-white">
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); playNext(); }} className="p-2 rounded-full bg-white/10 text-white">
                    <SkipForward size={20} fill="currentColor" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </Collapse>
        {openMusicList && (
          <div className="absolute top-full right-0 z-200 w-full max-w-[320px] p-2 mt-2">
            <ul className="bg-indigo-900/95 border border-white/20 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl max-h-[400px]">
              <div className="p-3 border-b border-white/10">
                <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">Playlist</span>
              </div>
              <div className="overflow-y-auto custom-scrollbar max-h-[350px]">
                {Array.isArray(playlist) && playlist.length > 0 ? (
                  playlist.map((item, index) => (
                    <li
                      key={index}
                      className={`h-12 px-4 flex items-center hover:bg-white/10 transition-colors border-b border-white/5 last:border-0 cursor-pointer ${currentSong?.id === item.id ? 'bg-indigo-500/30' : ''}`}
                      onClick={() => {
                        setCurrentSong(item);
                        setOpenMusicList(false);
                        // Optional: close after selection
                        // setOpenMusicList(false);
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
      </Navbar>

      {/* Music Dropdown - Moved here for better visibility and higher Z-index */}


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
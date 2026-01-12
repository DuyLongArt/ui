// 1. Define what the PROPS object looks like
interface MusicListProps {
    title: string[]; // Change this to string[] so you can .map() over it
    url: string[];
}
const MusicList: React.FC<MusicListProps> = ({ title }) => {
    return (
        <ul className="absolute top-0 left-0 z-30 gap-y-4 bg-indigo-800 gap-2 max-h-[600px] min-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {title.map((item, index) => (
                <li key={index} className="h-8  border-2 border-blue-600 flex items-center">
                    <div>
                        <button onClick={() => console.log(item)}>{item}</button>
                        {/* <p>{item}</p> */}
                    </div>
                </li>
            ))}
        </ul>
    );
};

export { MusicList };
export type { MusicListProps };
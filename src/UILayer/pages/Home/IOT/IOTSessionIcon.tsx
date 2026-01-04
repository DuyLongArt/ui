


type IOTSessionIconProps={
    title:string,
    icon:string,
    onClick:()=>void
}

const IOTSessionIcon:React.FC<IOTSessionIconProps>=({title,icon,onClick})=>{


    return(
        <div  className="cursor-pointer hover:scale-105 transition-transform 
       hover:bg-indigo-800
       hover:text-white
        
        " onClick={onClick}>
            <div>
                <img src={icon} alt="" />
            </div>
            <div>
                <p>{title}</p>
            </div>
        </div>
    )
}

export default IOTSessionIcon;
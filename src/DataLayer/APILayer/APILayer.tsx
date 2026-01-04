import axios from 'axios';
export const  getJWT = async ()=>{
    axios.get("/sercurityLayer/login/jwt",

    ).then(res=>{
        return res.data;
    }).catch(()=>console.error("DuyLong/Error"));

    
}



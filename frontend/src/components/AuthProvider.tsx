"use client";

import { verifyJWT } from "@/api";

import { createContext,  useEffect, useState } from "react"

export interface dataProps {
    isModerator : Boolean ,
    name : string 
}

export interface AuthProps {
     isLogin : Boolean ,
     data : dataProps | null 
}

export const AuthContext = createContext<AuthProps>({isLogin:false,data:null})

function AuthProvider({ children }: { children: any }) {

    const [isLogin, setLogin] = useState(false)

    const [loading, setLoading] = useState(true)

    const [data, setData] = useState<dataProps|null>(null)

    useEffect(() => {

        (
            async () => {
                const resp = await verifyJWT()

                if (resp) {
                    setLogin(true)
                    setData(resp.data)
                    console.log(resp.data)
                }

                setLoading(false)

            }
        )()
    }, [])


    return (
        <AuthContext.Provider value={{ isLogin, data }}>

            {
                loading ? <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
                    Loading..</div> : children
            }


        </AuthContext.Provider>
    )
}

export default AuthProvider
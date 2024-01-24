
"use client";

import { login, signup } from "@/api";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify"
import { AuthContext } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

function Login() {

    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const [requesting, setRequesting] = useState(false);
    const { isLogin } = useContext(AuthContext)
    const router = useRouter()

    useEffect(() => {

        if (isLogin) router.push("/")

    }, [isLogin, router])

    const handler = async () => {


        if (emailRef.current && emailRef.current.value.trim().length === 0) {
            toast.error("Email is empty")
            return;
        }
        if (passwordRef.current && passwordRef.current.value.trim().length === 0) {
            toast.error("password is empty")
            return;
        }

        setRequesting(true)

        const resp = await login({
            email: emailRef.current?.value,
            password: passwordRef.current?.value
        })

        setRequesting(false)

        if (resp) {

            if (resp.data.status === "Success") {
                toast.success("Login Success")
                localStorage.removeItem("token")
                localStorage.setItem("token", resp.data.token)
                window.location.reload()
            }

            else
                toast.error(resp.data.message)
        }
        else {
            toast.error("Something went wrong")
        }


    }
    if (isLogin) return <></>


    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <h3 className="text-xl ">Login</h3>
            <div className="flex gap-4 flex-col p-4">
                <input
                    type="text"
                    className="px-4 py-2 border rounded-md shadow-md focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="Enter your Email"
                    ref={emailRef}
                />
                <input
                    type="text"
                    className="px-4 py-2 border rounded-md shadow-md focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="Enter your Password"
                    ref={passwordRef}
                />

                <div>
                    Don&apos;t have account ? <Link className="text-blue-500" href="/signup">Signup</Link>
                </div>
                <button disabled={requesting} className={`${!requesting ? "bg-red-600" : "bg-red-200"} p-2 rounded-md shadow-md text-white`} onClick={async () => await handler()} >{requesting ? "Please wait..." : "Login"}</button>
            </div>
            <ToastContainer></ToastContainer>
        </div>

    )
}

export default Login 
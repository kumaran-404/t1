
"use client";

import { signup } from "@/api";
import { AuthContext, AuthProps } from "@/components/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify"

function Signup() {

    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const moderatorRef = useRef<HTMLSelectElement>(null)
    const nameRef = useRef<HTMLInputElement>(null)

    const { isLogin } = useContext(AuthContext)
    const router = useRouter()

    useEffect(() => {

        if (isLogin) router.push("/")

    }, [isLogin])

    const handler = async () => {


        if (emailRef.current && emailRef.current.value.trim().length === 0) {
            toast.error("Email is empty")
            return;
        }
        if (passwordRef.current && passwordRef.current.value.trim().length === 0) {
            toast.error("password is empty")
            return;
        }
        if (nameRef.current && nameRef.current.value.trim().length === 0) {
            toast.error("name is empty")
            return;
        }

        const resp = await signup({
            email: emailRef.current?.value,
            isModerator: moderatorRef.current?.value == "Moderator",
            name: nameRef.current?.value,
            password: passwordRef.current?.value
        })

        if (resp) {
            if (resp.data.status === "Success") {
                toast.success("Created Successfully,Please Login")

            }

            else
                toast.error(resp.data.message)
        }
        else {
            toast.error("Something went wrong")
        }



    }

    if(isLogin) return <></>


    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <h3 className="text-xl ">Signup</h3>
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
                <input
                    type="text"
                    className="px-4 py-2 border rounded-md shadow-md focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="Enter your Name"
                    ref={nameRef}
                />
                <select
                    ref={moderatorRef}
                    className="appearance-none px-4 py-2 border rounded-md shadow-md focus:outline-none focus:ring focus:border-blue-300"
                >
                    <option selected value={"Moderator"} className="bg-gray-200">Moderator</option>
                    <option value={"User"} className="bg-gray-200">User</option>
                </select>
                <div>
                    Already have account ? <Link className="text-blue-500" href="/login">Login</Link>
                </div>
                <button className='bg-red-600 p-2 rounded-md shadow-md text-white' onClick={async () => await handler()} >Create Account</button>
            </div>
            <ToastContainer></ToastContainer>
        </div>

    )
}

export default Signup 
"use client";

import Card from "@/components/Card"
import { useContext, useEffect, useState } from "react";
import { createDiscussion, fetchAllDiscussion } from "../api/index"
import { MdCreate } from "react-icons/md";
import Popup from 'reactjs-popup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import { AuthContext } from "@/components/AuthProvider";
import { BiLogOutCircle } from "react-icons/bi";

export default function Home() {

  const [data_, setData] = useState([])
  const [open, setOpen] = useState(false)

  const { isLogin, data } = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {

    if (!isLogin) router.push("/login")

  }, [isLogin])

  const openModal = () => setOpen(true)
  const closeModal = () => setOpen(false)

  const contentStyle = { background: 'white' };
  const overlayStyle = { background: 'rgba(0,0,0,0.5)' };
  const arrowStyle = { color: '#000' };

  const fetchHandler = async () => {
    const resp = await fetchAllDiscussion()
    console.log(resp)
    if (resp !== null) {
      setData(resp)
    }
  }

  useEffect(() => {

    // if(!isLogin){
    //   router.push("/login")
    // }

    (async () => {
      await fetchHandler()

    })()


  }, [router])

  const postHandler = async () => {

    let topic_ = document.getElementById("topic") as HTMLInputElement | null, content_ = document.getElementById("content") as HTMLInputElement | null

    let topic = topic_?.value || "", content = content_?.value || ""

    const resp = await createDiscussion({ topic, content })

    if (resp) {
      await fetchHandler()
      toast.success("Created successfully")
    }

    closeModal()

  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.reload()
  }

  if (!isLogin) return <></>


  return (


    <div className="p-4 md:mx-64 flex flex-col gap-8 shadow-lg min-h-screen">

      <div className="text-lg flex flex-row slate-500 font-semibold justify-between">
        Welcome {data?.name} !
        <button onClick={handleLogout} className="text-white bg-red-700 p-2 rounded-md shadow-md flex items-center gap-4"><BiLogOutCircle />Logout</button>
      </div>

      <div>{data?.isModerator ? "You are Moderator" : "You are not Moderator"}</div>

      <h1 className="pointer text-2xl font-white font-semibold mt-2">Latest Discussions</h1>

      <button onClick={openModal} className="bg-red-700 p-2 rounded-md shadow-md text-white w-max flex gap-4 items-center"><MdCreate></MdCreate> Start New Discussion</button>

      {
        data_.map((item, pos) => {
          return (
            <Card fetchHandler={fetchHandler} key={pos} data={item}></Card>
          )
        })
      }

      <Popup open={open} {...{ contentStyle, arrowStyle, overlayStyle }} closeOnDocumentClick onClose={closeModal}>


        <div className="p-8">

          <input
            id="topic"
            name="topic"
            className="my-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Topic Name"
            type="text"
          />

          <textarea
            id="content"
            name="content"
            className="my-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Your thoughts"
            rows={5}
          ></textarea>

          <button onClick={async () => await postHandler()} className="bg-red-700 p-2 rounded-md shadow-md text-white w-max flex gap-4 items-center">Post</button>


        </div>

      </Popup>

      <ToastContainer />

    </div>
  )
}

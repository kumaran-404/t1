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
import LibraryLoader from "@/components/LibraryLoader";



export default function Home() {

  const [data_, setData] = useState([])
  const [open, setOpen] = useState(false)
  const [requesting, setRequesting] = useState(false)
  const [postRequesting, setPostRequesting] = useState(false)

  const { isLogin, data } = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {

    if (!isLogin) router.push("/login")

  }, [isLogin, router])

  const openModal = () => setOpen(true)
  const closeModal = () => setOpen(false)

  const contentStyle = { background: 'white' };
  const overlayStyle = { background: 'rgba(0,0,0,0.5)' };
  const arrowStyle = { color: '#000' };

  const fetchHandler = async () => {

    setRequesting(true)

    const resp = await fetchAllDiscussion()

    setRequesting(false)

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

    setPostRequesting(true)

    const resp = await createDiscussion({ topic, content })

    setPostRequesting(false)

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

      <LibraryLoader />

      <div className="text-lg flex flex-row slate-500 font-semibold justify-between">
        Welcome {data?.name} !
        <button onClick={handleLogout} className="text-white bg-red-700 p-2 rounded-md shadow-md flex items-center gap-4"><BiLogOutCircle />Logout</button>
      </div>

      <div>{data?.isModerator ? "You are Moderator (Moderators have special access)" : "You are not Moderator (Moderators have special access)"}</div>


      <h1 className="pointer text-2xl font-white font-semibold mt-2">Latest Discussions</h1>
      <button onClick={openModal} className="bg-red-700 p-2 rounded-md shadow-md text-white w-max flex gap-4 items-center">
        {/* <lord-icon
        src="https://cdn.lordicon.com/wuvorxbv.json"
        trigger="loop"
        delay="500"
        colors="primary:#ffffff,secondary:#fad1e6"
        state="in-dynamic"
        stroke="bold"
        style={{ width: "20px", height: "20px", color: "white" }}
      ></lord-icon> */}
        Start New Discussion </button>

      {requesting && <div className="flex items-center gap-2">
        {/* <lord-icon
          src="https://cdn.lordicon.com/nchegqgo.json"
          trigger="loop"
          style={{ width: "20px", height: "20px" }}></lord-icon> */}
        <span>Fetching Discussions...</span>

      </div>}



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

          <button disabled={postRequesting} onClick={async () => await postHandler()} className={`${postRequesting ? "bg-red-200" : "bg-red-600"} p-2 rounded-md shadow-md text-white w-max flex gap-4 items-center`}>Post</button>


        </div>

      </Popup>

      <ToastContainer />

    </div>
  )
}

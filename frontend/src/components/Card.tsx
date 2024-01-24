import { deleteDiscussion } from "@/api";
import Link from "next/link";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { IoChatboxOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";


function Card({ data, fetchHandler }: { data: any, fetchHandler: any }) {

    const [requesting, setRequesting] = useState(false)

    const handleDelete = async (id: any) => {

        setRequesting(true)

        const resp = await deleteDiscussion(id)

        setRequesting(false)

        if (resp) {

            if (resp["status"] == "Success") {
                toast.success(resp.message)
                await fetchHandler()
            }
            else toast.error(resp.message)
        }

    }



    return (
        <div className="p-4 rounded-lg shadow-lg flex  flex-col">
            <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-slate-900">
                    <Link href={`/discussion/${data.id}`}>{data.topic}</Link>
                </h4>
                <button className={` ${requesting ? "text-red-200" : "text-red-600 "}text-md flex items-center gap-4`} disabled={requesting} onClick={() => handleDelete(data.id)}><MdDelete />{requesting ? "Deleting.." : "Delete"}</button>

            </div>

            <div className="flex gap-8">
                <div className="text-sm font-medium text-slate-700 mt-2">
                    {new Date(data.createdAt).toDateString()}
                </div>
                <div className="text-sm font-medium text-slate-700 mt-2">
                    {new Date(data.createdAt).toLocaleTimeString()}
                </div>
                <div className="text-sm  font-medium text-red-700 mt-2">
                    {data.User.name}
                </div>
            </div>
            <div className="flex gap-8 self-end ">
                <div className="flex items-center gap-4">
                    {data.likes + " "}<FaHeart />
                </div>
                <div className="flex items-center gap-4">
                    {data.comments + " "}<IoChatboxOutline />
                </div>
            </div>

        </div>
    )
}

export default Card
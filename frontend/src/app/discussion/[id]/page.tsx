"use client";
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BiUpvote } from "react-icons/bi";
// import { BiSolidUpvote } from "react-icons/bi";
import { BiDownvote } from "react-icons/bi";
// import { BiSolidDownvote } from "react-icons/bi";
import { IoChatboxOutline } from 'react-icons/io5';
import { MdKeyboardBackspace } from "react-icons/md";
import Link from 'next/link';
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import CommentSection from '@/components/CommentSection';
import { fetchComment, fetchDiscussion, postComment } from '@/api';

function Discussion({ params }: { params: { id: String } }) {

  const [show, setShow] = useState(false)

  const [data, setData] = useState({ "topic": "", "content": "", "createdAt": "", "likes": "", "comments": "", "User": { name: "" } })

  const router = useRouter()

  const commentRef = useRef<HTMLTextAreaElement>(null)

  const [loading, setLoading] = useState(true)

  const [requesting, setRequesting] = useState(false)

  const [comments, setComments] = useState([])

  const [loadComments, setLoadComments] = useState(-1)  //-1 for loading , 1 for obtained 

  const handlePostComment = async () => {

    const newComment = commentRef.current?.value

    if (newComment && newComment.trim().length === 0) return;

    setRequesting(true)

    const resp = await postComment(params.id, newComment)

    setRequesting(false)

    // commentRef.current?.value = ""

    if (resp) {
      await handleFetchComment()
    }
    else {
      console.log("Something went wrong")
    }


  }

  const handleFetchComment = useCallback(async () => {
    setLoadComments(-1)

    const res = await fetchComment(params.id)

    setComments(res)

    setLoadComments(1)
  }, [params.id])

  useEffect(() => {

    (
      async () => {



        const res = await fetchDiscussion(params.id)

        if (res == null) {
          router.push("/")
        }
        else {

          const c = await handleFetchComment()

          setLoading(false)

          setData(res)
        }
      })()
  }, [router, handleFetchComment, params.id])


  return (
    <>
      {
        loading ? <div className='absolute top-1/2 left-1/2'>
          <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
        </div> : <div className='p-4 md:mx-64 shadow-lg min-h-screen'>

          <div className='text-3xl mb-8  rounded-full shadow-lg w-max p-2'>

            <Link href="/">
              <MdKeyboardBackspace ></MdKeyboardBackspace>
            </Link>

          </div>
          <div className='my-8 text-slate-500'>
            Posted By {data.User.name} at {new Date(data.createdAt).toDateString()}
          </div>
          <div className='capitalize  text-3xl'>
            {data.topic}
          </div>
          <div className='flex flex-col-reverse  gap-8 items-start '>
            <div className='flex gap-4'>
              <div className='flex items-center text-2xl  cursor-pointer'>
                <span>{data.likes}</span>
                <BiUpvote></BiUpvote>
              </div >
              <div className='flex items-center text-2xl cursor-pointer'>

                <BiDownvote  ></BiDownvote>
              </div >
            </div>
            <div className='my-4'>
              {data.content}
            </div>

          </div>

          <div>
            <textarea
              id="comment"
              name="comment"
              className="my-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Your thoughts"
              rows={5}
              ref={commentRef}
            ></textarea>
            <button className={`${requesting ? "bg-red-200" : "bg-red-600"} p-2 rounded-md shadow-md focus:ring focus:ring-red-300 text-white disabled:bg-red-100`} disabled={requesting} onClick={async () => { await handlePostComment() }} >{loadComments === -1 ? "Loading" : "Comment"}</button>
          </div>

          <div className='cursor-pointer'>
            <div onClick={() => setShow(prev => !prev)} className='flex text-red-700 text-md items-center gap-4 mt-8'>

              <IoChatboxOutline></IoChatboxOutline>
              {comments.length} Comments{
                show ? <IoMdArrowDropup></IoMdArrowDropup>
                  :
                  <IoMdArrowDropdown></IoMdArrowDropdown>
              }
            </div>

            <CommentSection loadComments={loadComments} comments={comments} handleFetchComment={handleFetchComment} show={show}></CommentSection>

          </div>

        </div >
      }
    </>

  )
}

export default Discussion
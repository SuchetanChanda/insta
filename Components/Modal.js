/* eslint-disable @next/next/no-img-element */
import React, { Fragment, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { modalState } from '../atoms/modalAtom'
import { Dialog, Transition } from '@headlessui/react'
import { CameraIcon } from '@heroicons/react/outline'
import {db, storage} from '../firebase';
import { useSession } from 'next-auth/react'
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { ref , getDownloadURL , uploadString } from 'firebase/storage'
function Modal() {
  const {data:session} = useSession();
  const [open, setOpen] = useRecoilState(modalState)
  const filePickerRef = useRef(null);
  const captionRef = useRef(null);
  const [loading , setLoading] = useState(false);
  const [selectedFile , setSelectedFile] = useState(null);
  

  const uploadPost = async () => {
    if(loading) return;

    setLoading(true);

    // 1. Create a post and add to firestore 'posts' collection
    // 2. Get the post ID for the newly created post
    // 3. Upload the image to firebase storage with the post ID.
    // 4. Get a download URL from fb storage and update the original post with image

    const docRef = await addDoc(collection(db, 'posts'), {
        username : session.user.username, 
        caption : captionRef.current.value,
        profileImg : session.user.image, 
        timestamp: serverTimestamp()
    }) 

    console.log("New doc added with ID" , docRef.id);

    const imageRef = ref(storage , `posts/${docRef.id}/image`);

    await uploadString(imageRef, selectedFile, "data_url").then(async snapshot => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, 'posts', docRef.id), {
            image: downloadURL
        })
    });

    setOpen(false);
    setLoading(false);
    setSelectedFile(null);
  }

  const addImageToPost = (e) => {
      const reader = new FileReader();
      if(e.target.files[0]) {
          reader.readAsDataURL(e.target.files[0]);
      }

      reader.onload = (readerEvent) => {
          setSelectedFile(readerEvent.target.result);
      };

  };
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={setOpen}
      >
        <div className="flex min-h-[800px] items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:min-h-screen sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 transition-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 transition-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="mt-20 inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle">
              <div>
                    {selectedFile ? (
                        <img src={selectedFile} 
                        className='w-full object-contain cursor-pointer'
                        onClick={() => setSelectedFile(null)} alt="" />
                    ): (
                        <div
                  onClick={() => filePickerRef.current.click()}
                  className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer'
                  >
                      <CameraIcon
                       className='h-6 w-6 text-red-600'
                       aria-hidden='true'
                       />

                  </div>
                    )}
                  
                <div>
                    <div className='mt-3 text-center sm:mt-5'>
                        <Dialog.Title 
                        as='h3'
                        className='text-lg leading-6 font-medium text-gray-900'
                        >
                            Upload a photo
                        </Dialog.Title>

                        <div>
                            <input 
                            ref={filePickerRef}
                            type="file"
                            hidden
                            onChange={addImageToPost}
                            />
                        </div>

                        <div className='mt-2'>
                            <input className='border-none focus:ring-0 w-full text-center' 
                            type="text" 
                            ref = {captionRef}
                            placeholder='Please enter a caption...'/>
                        </div>
                    </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  {selectedFile ? (
                    <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none 
                                focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 hover:disabled:bg-gray-300 sm:text-sm
                                "
                    onClick={uploadPost}
                  >
                      {loading ? "Uploading..." : "Upload Post"}
                  </button>
                  ): (
                    <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none 
                                focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 hover:disabled:bg-gray-300 sm:text-sm
                                "
                  >
                      {loading ? "Uploading..." : "Upload Post"}
                  </button>

                  )}
                  
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default Modal

import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {toast} from "react-hot-toast";
import EmojiPicker from 'emoji-picker-react';


const CreatePost = () => {
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const emojiPickerRef = useRef(null);
	const imgRef = useRef(null);

	const {data: authUser, isLoading, isError} = useQuery({queryKey: ['authUser']});
	const queryClient = useQueryClient();

	const {mutate:createPost, isPending, isError: isPostError, error} = useMutation({
		mutationFn: async ({text,img}) => {
			try {
				const res = await fetch("/api/posts/create", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({text,img}),
				});
				const data = await res.json();
				if(!res.ok) {
					throw new Error(data.error || "Something went wrong")
				}
				return data
			} catch(error) {
				throw new Error(error)
			}
		},
		onSuccess: () => {
			setText("");
			setImg(null);
			toast.success("Post created successfully");
			queryClient.invalidateQueries({queryKey: ['posts']})
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		createPost({text, img})
	};

	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleEmojiClick = (emoji) => {
		setText((prevText) => prevText + emoji.emoji);
		setShowEmojiPicker(false); 
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
		  if (
			emojiPickerRef.current &&
			!emojiPickerRef.current.contains(event.target)
		  ) {
			setShowEmojiPicker(false);
		  }
		};
	  
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
		  document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);
	  

	if (isLoading) return <div>Loading...</div>;

	if (isError) return <div>Error loading user data</div>;

	return (
		<div className='flex p-4 items-start gap-4 border-b border-gray-700'>
			<div className='avatar'>
				<div className='w-8 rounded-full'>
					<img src={authUser.profileImg || "/avatar-placeholder.png"} />
				</div>
			</div>
			<form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
				<textarea
					className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800'
					placeholder='What is happening?!'
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				{img && (
					<div className='relative w-72 mx-auto'>
						<IoCloseSharp
							className='absolute top-0 right-0 text-base-content bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
							onClick={() => {
								setImg(null);
								imgRef.current.value = null;
							}}
						/>
						<img src={img} className='w-full mx-auto h-72 object-contain rounded' />
					</div>
				)}

				<div className='flex justify-between border-t py-2 border-t-gray-700'>
					<div className='flex gap-1 items-center'>
						<CiImageOn
							className='fill-primary w-6 h-6 cursor-pointer'
							onClick={() => imgRef.current.click()}
						/>
						<BsEmojiSmileFill
							className='fill-primary w-5 h-5 cursor-pointer'
							onClick={(e) => {
								e.stopPropagation(); // prevents it from bubbling to the document
								setShowEmojiPicker(!showEmojiPicker);
							}}
						/>
					</div>
					<input type='file' accept='image/*' hidden ref={imgRef} onChange={handleImgChange} />
					<button className='btn btn-primary rounded-full btn-sm text-base-content px-4'>
						{isPending ? "Posting..." : "Post"}
					</button>
				</div>

				{/* Show Emoji Picker if the state is true */}
				{showEmojiPicker && (
					<div
						ref={emojiPickerRef} // attach the ref here
						className='absolute bottom-14 z-50' // add z-index to be sure it's on top
					>
						<EmojiPicker onEmojiClick={handleEmojiClick} />
					</div>
				)}

				{isPostError && <div className='text-red-500'>{error.message}</div>}
			</form>
		</div>
	);
};
export default CreatePost;
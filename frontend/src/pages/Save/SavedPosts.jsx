import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Post from "../../components/common/Post";
import RightPanel from "../../components/common/RightPanel";

const SavedPosts = () => {
	const { data: posts, isLoading, isError } = useQuery({
		queryKey: ["savedPosts"],
		queryFn: async () => {
			const res = await fetch("/api/posts/saved", {
                credentials: "include", 
            });
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to fetch saved posts");
			return data;
		}
	});

	if (isLoading) {
		return (
			<div className='flex justify-center mt-10'>
				<LoadingSpinner size='lg' />
			</div>
		);
	}

	return (
		<div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
			<div className="p-4 border-b border-gray-700">
				<h2 className="font-bold text-xl">Your Saved Posts</h2>
			</div>
			<div className="flex flex-col gap-4 p-4">
				{isError || posts.length === 0 ? (
						<div className="flex justify-center items-center h-[50vh]">
							<p className="text-slate-500 text-lg font-semibold">
								No saved posts found 🤔
							</p>
						</div>
					) : (
						posts.map((post) => <Post key={post._id} post={post} />)
					)
				}
			</div>
		</div>
	);
};

export default SavedPosts;

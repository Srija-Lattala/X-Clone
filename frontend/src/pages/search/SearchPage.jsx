import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const SearchPage = () => {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const navigate = useNavigate();

	const handleSearchChange = (e) => {
		setQuery(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if(query.trim()) {
			const matchedUser = results.find(
				(user) =>
					 user.username.toLowerCase() === query.trim().toLowerCase() ||
				     user.fullName.toLowerCase() === query.trim().toLowerCase()
			);
			if(matchedUser) {
				navigate(`/profile/${matchedUser.username}`, {
					state: { fromSearch: true },
				});
			} else {
				setResults(results);
			}
		}
	};

	useEffect(() => {
		
		const fetchResults = async () => {
		  if (query.trim()) {
			try {
			  const response = await fetch(`/api/users/search?query=${query.trim()}`);
			  if(response.ok) {
				const data = await response.json();
				setResults(data);
			  } else {
				console.log("Error fetching search results:", response.statusText);
				setResults([]);
			  }
			} catch (error) {
			  console.log("Error fetching search results:", error);
			  setResults([]);
			}
		  } else {
			setResults([]); 
		  }
		};
	
		fetchResults();
	  }, [query]); 

	return (
		<div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
			<div className="p-4 border-b border-gray-700">
				<h2 className="font-bold text-xl">Search Users</h2>
			</div>

			<div className="p-4">
				<form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
					<input
						type="text"
						placeholder="Enter username or full name"
						value={query}
						onChange={handleSearchChange}
						className="input input-bordered w-full bg-base-200 text-base-content placeholder:text-base-content"
					/>
					<button type="submit" className="btn btn-primary">
						Go
					</button>
				</form>

				{/* Show results */}
				{results.length > 0 && query.trim() && (
					<div className="mt-6 space-y-2 max-w-md mx-auto">
						{results.map((user) => (
							<div
								key={user._id}
								className="p-3 rounded-md hover:bg-gray-800 cursor-pointer bg-gray-700 text-white"
								onClick={() => navigate(`/profile/${user.username}` , {
									state: { fromSearch: true },
								  })
								}
							>
								<p className="font-medium">{user.fullName} (@{user.username})</p>
							</div>
						))}
					</div>
				)}

				{/* No users found */}
				{query.trim() && results.length === 0 && (
					<div className="mt-6 text-center text-gray-400">No users found</div>
				)}
			</div>
		</div>
	);
};

export default SearchPage;

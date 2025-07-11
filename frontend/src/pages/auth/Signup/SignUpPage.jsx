import { Link } from "react-router-dom";
import { useState } from "react";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail, MdPassword, MdDriveFileRenameOutline } from "react-icons/md";
import { FaUser } from "react-icons/fa";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SignUpPage = () => {
	const queryClient = useQueryClient();
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		fullName: "",
		password: "",
	});

	const { mutate, isError, isPending, error } = useMutation({
		mutationFn: async ({ email, username, fullName, password }) => {
			try {
				const res = await fetch("/api/auth/signup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, username, fullName, password }),
				});

				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Failed to create account");
				console.log("Signup successful:", data);
				return data;
			} catch (error) {
				console.error("Signup error:", error);
				throw error;
			}
		},
		onSuccess: () => {
			toast.success("Account created successfully");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		mutate(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className="max-w-screen-xl mx-auto flex h-screen bg-base-100 text-base-content px-4">
			<div className="flex-1 hidden lg:flex items-center justify-center">
				<XSvg className="lg:w-2/3 fill-base-content" />
			</div>
			<div className="flex-1 flex flex-col justify-center items-center">
				<form
					className="w-full max-w-md flex gap-4 flex-col"
					onSubmit={handleSubmit}
				>
					<XSvg className="w-24 lg:hidden fill-base-content self-center" />
					<h1 className="text-4xl font-extrabold text-center">Join today.</h1>

					<label className="input input-bordered rounded flex items-center gap-2 bg-base-200">
						<MdOutlineMail />
						<input
							type="email"
							className="grow bg-transparent outline-none"
							placeholder="Email"
							name="email"
							onChange={handleInputChange}
							value={formData.email}
						/>
					</label>

					<div className="flex flex-wrap gap-4">
						<label className="input input-bordered rounded flex items-center gap-2 flex-1 bg-base-200">
							<FaUser />
							<input
								type="text"
								className="grow bg-transparent outline-none"
								placeholder="Username"
								name="username"
								onChange={handleInputChange}
								value={formData.username}
							/>
						</label>
						<label className="input input-bordered rounded flex items-center gap-2 flex-1 bg-base-200">
							<MdDriveFileRenameOutline />
							<input
								type="text"
								className="grow bg-transparent outline-none"
								placeholder="Full Name"
								name="fullName"
								onChange={handleInputChange}
								value={formData.fullName}
							/>
						</label>
					</div>

					<label className="input input-bordered rounded flex items-center gap-2 bg-base-200">
						<MdPassword />
						<input
							type="password"
							className="grow bg-transparent outline-none"
							placeholder="Password"
							name="password"
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>

					<button className="btn rounded-full btn-primary">
						{isPending ? "Loading..." : "Sign up"}
					</button>
					{isError && <p className="text-error">{error.message}</p>}
				</form>

				<div className="flex flex-col gap-2 mt-4 w-full max-w-md">
					<p className="text-center text-lg">Already have an account?</p>
					<Link to="/login">
						<button className="btn rounded-full btn-outline w-full">
							Sign in
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default SignUpPage;
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";
import toast from "react-hot-toast";

const EditProfileModal = ({ authUser }) => {
	const [formData, setFormData] = useState({
		fullName: "",
		username: "",
		email: "",
		bio: "",
		link: "",
		newPassword: "",
		currentPassword: "",
	});

	const [removingProfile, setRemovingProfile] = useState(false);
	const [removingCover, setRemovingCover] = useState(false);
	const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();
	const queryClient = useQueryClient();

	useEffect(() => {
		if (authUser) {
			setFormData({
				fullName: authUser.fullName,
				username: authUser.username,
				email: authUser.email,
				bio: authUser.bio,
				link: authUser.link,
				newPassword: "",
				currentPassword: "",
			});
		}
	}, [authUser]);

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleRemoveProfileImage = async () => {
		setRemovingProfile(true);
		try {
			const res = await fetch("/api/users/removeProfileImage", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			if (!res.ok) throw new Error("Failed to remove profile image");
			
			queryClient.setQueryData(["authUser"], (prev) => ({
				...prev,
				profileImg: null,
			}));
		} catch (error) {
			console.error(error);
			toast.error("Something went wrong!");
		} finally {
			setRemovingProfile(false);
		}
	};

	const handleRemoveCoverImage = async () => {
		setRemovingCover(true);
		try {
			const res = await fetch("/api/users/removeCoverImage", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			if (!res.ok) throw new Error("Failed to remove cover image");

			queryClient.setQueryData(["authUser"], (prev) => ({
				...prev,
				coverImg: null,
			}));
		} catch (error) {
			console.error(error);
			toast.error("Something went wrong!");
		} finally {
			setRemovingCover(false);
		}
	};

	return (
		<>
			<button
				className='btn btn-outline rounded-full btn-sm'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit profile
			</button>

			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box border rounded-md border-gray-700 shadow-md'>
					<h3 className='font-bold text-lg my-3'>Update Profile</h3>
					<form
						className='flex flex-col gap-4'
						onSubmit={(e) => {
							e.preventDefault();
							const dataToSend = { ...formData };
							if (!formData.currentPassword.trim() && !formData.newPassword.trim()) {
								delete dataToSend.currentPassword;
								delete dataToSend.newPassword;
							}
							if (formData.newPassword && !formData.currentPassword) {
								toast.error("Enter current password to set a new password.");
								return;
							}
							updateProfile(dataToSend);
						}}
					>
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='Full Name'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.fullName}
								name='fullName'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='Username'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.username}
								name='username'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='email'
								placeholder='Email'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.email}
								name='email'
								onChange={handleInputChange}
							/>
							<textarea
								placeholder='Bio'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.bio}
								name='bio'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='password'
								placeholder='Current Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.currentPassword}
								name='currentPassword'
								autoComplete="new-password"
								onChange={handleInputChange}
							/>
							<input
								type='password'
								placeholder='New Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.newPassword}
								name='newPassword'
								autoComplete="new-password"
								onChange={handleInputChange}
							/>
						</div>
						<input
							type='text'
							placeholder='Link'
							className='flex-1 input border border-gray-700 rounded p-2 input-md'
							value={formData.link}
							name='link'
							onChange={handleInputChange}
						/>

						<div className="flex gap-4 justify-between">
							<button
								type="button"
								onClick={handleRemoveProfileImage}
								className="btn btn-outline btn-neutral btn-sm hover:bg-base-200 text-base-content"
								disabled={removingProfile}
							>
								{removingProfile ? "Removing..." : "Remove Profile Image"}
							</button>

							<button
								type="button"
								onClick={handleRemoveCoverImage}
								className="btn btn-outline btn-neutral btn-sm hover:bg-base-200 text-base-content"
								disabled={removingCover}
							>
								{removingCover ? "Removing..." : "Remove Cover Image"}
							</button>
						</div>

						<button className='btn btn-primary rounded-full btn-sm text-base-content'>
							{isUpdatingProfile ? "Updating..." : "Update"}
						</button>
					</form>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>close</button>
				</form>
			</dialog>
		</>
	);
};

export default EditProfileModal;

import React, { Fragment, useEffect } from "react";
import { useState } from "react";
import "./updateProfile.css";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import FaceIcon from "@material-ui/icons/Face";
import { useDispatch, useSelector } from "react-redux";
import {
	clearErrors,
	loadUser,
	updateProfile,
} from "../../redux/actions/userAction";
import { useAlert } from "react-alert";
import Loader from "../layout/loader/Loader";
import { useNavigate } from "react-router-dom";
import { UPDATE_USER_RESET } from "../../redux/constants/userConst";
import MetaData from "../layout/Metadata";

const UpdateProfile = () => {
	const dispatch = useDispatch();
	const alert = useAlert();
	let navigate = useNavigate();
	const { user } = useSelector((state) => state.user);
	const { error, isUpdated, loading } = useSelector((state) => state.profile);

	const [avatar, setAvatar] = useState("/user.png");
	const [avatarPreview, setAvatarPreview] = useState("/user.png");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");

	const updateProfileSubmit = (e) => {
		e.preventDefault();

		const myForm = new FormData();

		myForm.set("name", name);
		myForm.set("email", email);
		myForm.set("avatar", avatar);

		dispatch(updateProfile(myForm));
	};

	const updateProfileDataChange = (e) => {
		if (e.target.name === "avatar") {
			const reader = new FileReader();

			reader.onload = () => {
				if (reader.readyState === 2) {
					setAvatarPreview(reader.result);
					setAvatar(reader.result);
				}
			};
			reader.readAsDataURL(e.target.files[0]);
		}
	};

	useEffect(() => {
		if (user) {
			setName(user.name);
			setEmail(user.email);
			setAvatarPreview(user.avatar.url);
		}
		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}

		if (isUpdated) {
			alert.success("Profile updated successfully");
			dispatch(loadUser());
			navigate("/account");
			dispatch({ type: UPDATE_USER_RESET });
		}
	}, [dispatch, error, isUpdated]);

	return (
		<Fragment>
			{loading ? (
				<Loader />
			) : (
				<Fragment>
					<MetaData title="Update profile" />
					<div className="updateProfileContainer">
						<div className="updateProfileBox">
							<h2 className="updateProfileHeading">Update Profile</h2>
							<form
								className="updateProfileForm"
								encType="multipart/form-data"
								onSubmit={updateProfileSubmit}
							>
								<div className="updateProfileName">
									<FaceIcon />
									<input
										type="text"
										placeholder="Name"
										required
										name="name"
										value={name}
										onChange={(e) => setName(e.target.value)}
									/>
								</div>
								<div className="updateProfileEmail">
									<MailOutlineIcon />
									<input
										type="text"
										placeholder="Email"
										required
										name="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</div>

								<div id="updateProfileImage">
									<img src={avatarPreview} alt="Avatar Preview" />
									<input
										type="file"
										name="avatar"
										accept="image/*"
										onChange={updateProfileDataChange}
									/>
								</div>
								<input
									type="submit"
									value="Update"
									className="updateProfileBtn"
									// disabled={loading?true:false}
								/>
							</form>
						</div>
					</div>
				</Fragment>
			)}
		</Fragment>
	);
};

export default UpdateProfile;

import React, { Fragment, useEffect } from "react";
import { useState } from "react";
import "./updatePassword.css";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, updatePassword } from "../../redux/actions/userAction";
import { useAlert } from "react-alert";
import Loader from "../layout/loader/Loader";
import { useNavigate } from "react-router-dom";
import { UPDATE_PASSWORD_RESET } from "../../redux/constants/userConst";
import MetaData from "../layout/Metadata";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import VpnKeyIcon from "@material-ui/icons/VpnKey";

const UpdatePassword = () => {
	const dispatch = useDispatch();
	const alert = useAlert();
	let navigate = useNavigate();
	const { error, isUpdated, loading } = useSelector((state) => state.profile);

	const [oldPassword, setOldPasword] = useState("");
	const [newPassword, setNewPasword] = useState("");
	const [confirmPassword, setConfirmPasword] = useState("");

	const updatePasswordSubmit = (e) => {
		e.preventDefault();

		const myForm = new FormData();

		myForm.set("oldPassword", oldPassword);
		myForm.set("newPassword", newPassword);
		myForm.set("confirmPassword", confirmPassword);
		dispatch(updatePassword(myForm));
	};

	useEffect(() => {
		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}

		if (isUpdated) {
			alert.success("Profile updated successfully");
			navigate("/account");
			dispatch({ type: UPDATE_PASSWORD_RESET });
		}
	}, [dispatch, error, isUpdated]);
	return (
		<Fragment>
			{loading ? (
				<Loader />
			) : (
				<Fragment>
					<MetaData title="Change password" />
					<div className="updatePasswordContainer">
						<div className="updatePasswordBox">
							<h2 className="updatePasswordHeading">Change Password</h2>
							<form className="updatePasswordForm" onSubmit={updatePasswordSubmit}>
								<div className="loginPassword">
									<VpnKeyIcon />
									<input
										type="password"
										placeholder="Old Password"
										required
										value={oldPassword}
										onChange={(e) => setOldPasword(e.target.value)}
									/>
								</div>
								<div className="loginPassword">
									<LockOpenIcon />
									<input
										type="password"
										placeholder="New Password"
										required
										value={newPassword}
										onChange={(e) => setNewPasword(e.target.value)}
									/>
								</div>
								<div className="loginPassword">
									<LockIcon />
									<input
										type="password"
										placeholder="Confirm Password"
										required
										value={confirmPassword}
										onChange={(e) => setConfirmPasword(e.target.value)}
									/>
								</div>

								<input
									type="submit"
									value="Update"
									className="updatePasswordBtn"
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

export default UpdatePassword;

import React, { Fragment, useEffect } from "react";
import { useState } from "react";
import "./resetPassword.css";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, resetPassword } from "../../redux/actions/userAction";
import { useAlert } from "react-alert";
import Loader from "../layout/loader/Loader";
import { useNavigate } from "react-router-dom";
import MetaData from "../layout/Metadata";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
	const dispatch = useDispatch();
	const alert = useAlert();
	let navigate = useNavigate();
	const { error, success, loading } = useSelector(
		(state) => state.forgotPassword
	);

	const token = useParams();

	const [password, setPasword] = useState("");
	const [confirmPassword, setConfirmPasword] = useState("");

	const resetPasswordSubmit = (e) => {
		e.preventDefault();

		const myForm = new FormData();

		myForm.set("password", password);
		myForm.set("confirmPassword", confirmPassword);
		dispatch(resetPassword(token.token, myForm));
	};

	useEffect(() => {
		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}

		if (success) {
			alert.success("Password updated successfully");
			navigate("/login");
		}
	}, [dispatch, error, success]);
	return (
		<Fragment>
			{loading ? (
				<Loader />
			) : (
				<Fragment>
					<MetaData title="Reset password" />
					<div className="resetPasswordContainer">
						<div className="resetPasswordBox">
							<h2 className="resetPasswordHeading">Reset Password</h2>
							<form className="resetPasswordForm" onSubmit={resetPasswordSubmit}>
								<div>
									<LockOpenIcon />
									<input
										type="password"
										placeholder="New Password"
										required
										value={password}
										onChange={(e) => setPasword(e.target.value)}
									/>
								</div>
								<div>
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
									className="resetPasswordBtn"
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

export default ResetPassword;

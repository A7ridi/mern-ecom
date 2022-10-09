import React, { Fragment, useEffect } from "react";
import { useState } from "react";
import "./forgotPassword.css";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, forgotPassword } from "../../redux/actions/userAction";
import { useAlert } from "react-alert";
import Loader from "../layout/loader/Loader";
import { useNavigate } from "react-router-dom";
import MetaData from "../layout/Metadata";

const ForgotPassword = () => {
	const dispatch = useDispatch();
	const alert = useAlert();
	let navigate = useNavigate();
	const { error, message, loading } = useSelector(
		(state) => state.forgotPassword
	);

	const [email, setEmail] = useState("");

	const forgotPasswordSubmit = (e) => {
		e.preventDefault();

		const myForm = new FormData();

		myForm.set("email", email);

		dispatch(forgotPassword(myForm));
	};

	useEffect(() => {
		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}

		if (message) {
			alert.success(message);
		}
	}, [dispatch, error, message]);

	return (
		<Fragment>
			{loading ? (
				<Loader />
			) : (
				<Fragment>
					<MetaData title="Forgot Password" />
					<div className="forgotPasswordContainer">
						<div className="forgotPasswordBox">
							<h2 className="forgotPasswordHeading">Forgot Password</h2>
							<form
								className="forgotPasswordForm"
								encType="multipart/form-data"
								onSubmit={forgotPasswordSubmit}
							>
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

								<input
									type="submit"
									value="Send"
									className="forgotPasswordBtn"
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

export default ForgotPassword;

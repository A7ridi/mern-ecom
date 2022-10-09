import React, { Fragment, useState } from "react";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
import "./Header.css";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import Backdrop from "@material-ui/core/Backdrop";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/actions/userAction";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	staticTooltipLabel: {
		width: "80px",
		textAlign: "center",
	},
}));

const UserOptions = ({ user }) => {
	const classes = useStyles();
	const { cartItems } = useSelector((state) => state.cart);
	const [open, setOpen] = useState(false);
	let navigate = useNavigate();
	const alert = useAlert();
	const dispatch = useDispatch();

	const dashBoard = () => navigate("/dashboard");
	const orders = () => navigate("/orders");
	const account = () => navigate("/account");
	const cart = () => navigate("/cart");
	const logoutUser = () => {
		dispatch(logout());
		navigate("/login");
		alert.success("Logout successfully");
	};

	const options = [
		{ icon: <ListAltIcon />, name: "Orders", func: orders },
		{ icon: <PersonIcon />, name: "Profile", func: account },
		{
			icon: (
				<ShoppingCartIcon
					style={{ color: cartItems.length > 0 ? "tomato" : "unset" }}
				/>
			),
			name: `Cart (${cartItems.length})`,
			func: cart,
		},
		{ icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
	];

	if (user.role === "admin") {
		options.unshift({
			icon: <DashboardIcon />,
			name: "Dashboard",
			func: dashBoard,
		});
	}

	return (
		<Fragment>
			<Backdrop open={open} style={{ zIndex: "10" }} />
			<SpeedDial
				ariaLabel="SpeedDial tooltip example"
				onClose={() => setOpen(false)}
				onOpen={() => setOpen(true)}
				open={open}
				direction="down"
				className="speedDial"
				style={{ zIndex: "11" }}
				icon={
					<img
						className="speedDialIcon"
						alt="Profile"
						src={user.avatar.url ? user.avatar.url : "/user.png"}
					/>
				}
			>
				{options.map((item, i) => (
					<SpeedDialAction
						icon={item.icon}
						tooltipTitle={item.name}
						classes={classes}
						key={i}
						onClick={item.func}
						tooltipOpen
					/>
				))}
			</SpeedDial>
		</Fragment>
	);
};

export default UserOptions;

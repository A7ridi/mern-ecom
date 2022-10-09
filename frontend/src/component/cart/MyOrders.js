import React, { Fragment, useEffect } from "react";
import "./myOrders.css";
import { DataGrid } from "@material-ui/data-grid";
import { useAlert } from "react-alert";
import { Typography } from "@material-ui/core";
import Metadata from "../layout/Metadata";
import LaunchIcon from "@material-ui/icons/Launch";
import Loader from "../layout/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, myOrders } from "../../redux/actions/orderAction";
import { Link } from "react-router-dom";

const MyOrders = () => {
	const dispatch = useDispatch();
	const alert = useAlert();

	const { loading, error, orders } = useSelector((state) => state.myOrders);
	const { user } = useSelector((state) => state.user);

	const columns = [
		{ field: "id", headerName: "Order ID", width: "20%", flex: 0.5 },
		{
			field: "status",
			headerName: "Status",
			width: "20%",
			flex: 0.3,
			cellClassName: (params) => {
				return params.getValue(params.id, "status") === "Delivered"
					? "greenColor"
					: "redColor";
			},
		},
		{
			field: "itemsQty",
			headerName: "Items Qty",
			type: "number",
			width: "20%",
			flex: 0.3,
		},
		{
			field: "amount",
			headerName: "Amount",
			type: "number",
			width: "20%",
			flex: 0.5,
		},
		{
			field: "actions",
			headerName: "Actions",
			type: "number",
			width: "20%",
			flex: 0.3,
			renderCell: (params) => {
				return (
					<Link to={`/order/${params.getValue(params.id, "id")}`}>
						<LaunchIcon />
					</Link>
				);
			},
		},
	];
	const rows = [];

	orders &&
		orders.forEach((item) => {
			rows.push({
				itemsQty: item.orderItems.length,
				id: item._id,
				status: item.orderStatus,
				amount: item.totalPrice,
			});
		});

	useEffect(() => {
		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}
		dispatch(myOrders());
	}, [dispatch]);

	return (
		<Fragment>
			<Metadata title={`${user.name} - Orders`} />

			{loading ? (
				<Loader />
			) : (
				<div className="myOrdersPage">
					<Typography id="myOrdersHeading">{user.name}'s orders</Typography>

					<DataGrid
						rows={rows}
						columns={columns}
						pageSize={10}
						disableSelectionOnClick
						className="myOrdersTable"
						autoHeight
					/>
				</div>
			)}
		</Fragment>
	);
};

export default MyOrders;

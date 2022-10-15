import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./productList.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import Metadata from "../layout/Metadata";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SideBar from "./Sidebar";
import {
	getAllUsers,
	clearErrors,
	deleteUser,
} from "../../redux/actions/userAction";
import { DELETE_USER_RESET } from "../../redux/constants/userConst";

const UsersList = ({ history }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const alert = useAlert();

	const { error, users } = useSelector((state) => state.allUsers);

	const {
		error: deleteError,
		isDeleted,
		message,
	} = useSelector((state) => state.profile);

	const deleteUserHandler = (id) => {
		dispatch(deleteUser(id));
	};

	useEffect(() => {
		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}

		if (deleteError) {
			alert.error(deleteError);
			dispatch(clearErrors());
		}

		if (isDeleted) {
			alert.success(message);
			navigate("/admin/users");
			dispatch({ type: DELETE_USER_RESET });
		}

		dispatch(getAllUsers());
	}, [dispatch, error, deleteError, isDeleted, message]);

	const columns = [
		{ field: "id", headerName: "User ID", width: "20%", flex: 0.5 },

		{
			field: "email",
			headerName: "Email",
			width: "20%",
			flex: 0.5,
		},
		{
			field: "name",
			headerName: "Name",
			width: "20%",
			flex: 0.5,
		},

		{
			field: "role",
			headerName: "Role",
			type: "number",
			width: "20%",
			flex: 0.2,
			cellClassName: (params) => {
				return params.getValue(params.id, "role") === "admin"
					? "greenColor"
					: "redColor";
			},
		},

		{
			field: "actions",
			headerName: "Actions",
			width: "20%",
			flex: 0.3,
			type: "number",
			sortable: false,
			renderCell: (params) => {
				const checkSuperAdmin = params.row.email === "admin@ecom.com";
				return (
					<Fragment>
						{checkSuperAdmin ? null : (
							<Fragment>
								<Link to={`/admin/user/${params.getValue(params.id, "id")}`}>
									<EditIcon />
								</Link>

								<Button
									onClick={() => deleteUserHandler(params.getValue(params.id, "id"))}
								>
									<DeleteIcon />
								</Button>
							</Fragment>
						)}
					</Fragment>
				);
			},
		},
	];

	const rows = [];

	users &&
		users.forEach((item) => {
			rows.push({
				id: item._id,
				role: item.role,
				email: item.email,
				name: item.name,
			});
		});

	return (
		<Fragment>
			<Metadata title={`ALL USERS - Admin`} />

			<div className="dashboard">
				<SideBar />
				<div className="productListContainer">
					<h1 id="productListHeading">ALL USERS</h1>

					<DataGrid
						rows={rows}
						columns={columns}
						pageSize={10}
						disableSelectionOnClick
						className="productListTable"
						autoHeight
					/>
				</div>
			</div>
		</Fragment>
	);
};

export default UsersList;

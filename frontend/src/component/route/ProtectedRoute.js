import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isAdmin, component: Component, ...rest }) => {
	const { loading, isAuthenticated, user } = useSelector((state) => state.user);
	return (
		<Fragment>
			{loading === false && isAdmin && user?.role !== "admin" && (
				<Navigate to="/login" />
			)}
			{loading === false && isAuthenticated ? (
				<Outlet />
			) : (
				<Navigate to="/login" />
			)}
		</Fragment>
	);
};

export default ProtectedRoute;

// Old method
// <Route
// 	{...rest}
// 	render={(props) => {
// 		if (!isAuthenticated) {
// 			return <Navigate to="/login" />;
// 		}
// 		return <Component {...props} />;
// 	}}
// />

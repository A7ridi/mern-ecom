import "./App.css";
import Header from "./component/layout/header/Header";
import Footer from "./component/layout/footer/Footer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WebFont from "webfontloader";
import { useEffect, useState } from "react";
import Home from "./component/home/Home";
import ProductDetails from "./component/product/ProductDetails.js";
import Products from "./component/product/Products";
import Search from "./component/product/Search";
import LoginSignUp from "./component/user/LoginSignUp";
import { useSelector } from "react-redux";
import { loadUser } from "./redux/actions/userAction";
import store from "./store";
import UserOptions from "./component/layout/header/UserOptions.js";
import Profile from "./component/user/Profile";
import ProtectedRoute from "./component/route/ProtectedRoute";
import UpdateProfile from "./component/user/UpdateProfile";
import UpdatePassword from "./component/user/UpdatePassword";
import ForgotPassword from "./component/user/ForgotPassword";
import ResetPassword from "./component/user/ResetPassword";
import Cart from "./component/cart/Cart";
import Shipping from "./component/cart/Shipping";
import Confirm from "./component/cart/Confirm";
import axios from "axios";
import Payment from "./component/cart/Payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./component/cart/OrderSuccess";
import MyOrders from "./component/cart/MyOrders";
import OrderDetails from "./component/cart/OrderDetails";
import Dashboard from "./component/admin/Dashboard";
import ProductList from "./component/admin/ProductList";
import NewProduct from "./component/admin/NewProduct";
import UpdateProduct from "./component/admin/UpdateProduct";
import OrderList from "./component/admin/OrderList";

function App() {
	const { isAuthenticated, user } = useSelector((state) => state.user);
	const [stripeApiKey, setStripeApiKey] = useState("");

	async function getStripeApiKey() {
		const { data } = await axios.get("/api/v1/stripeapikey");
		setStripeApiKey(data.stripeApiKey);
	}

	useEffect(() => {
		WebFont.load({
			google: {
				families: ["Roboto", "Drold Sans", "Chilanka"],
			},
		});

		store.dispatch(loadUser());

		getStripeApiKey();
	}, []);
	return (
		<Router>
			<Header />
			{isAuthenticated && <UserOptions user={user} />}
			<Routes>
				<Route exact path="/" element={<Home />} />
				<Route exact path="/product/:id" element={<ProductDetails />} />
				<Route exact path="/products" element={<Products />} />
				<Route path="/products/:keyword" element={<Products />} />
				<Route exact path="/search" element={<Search />} />
				<Route exact path="/login" element={<LoginSignUp />} />
				<Route exact path="/account" element={<ProtectedRoute />}>
					<Route exact path="/account" element={<Profile />} />
				</Route>
				<Route exact path="/me/update" element={<ProtectedRoute />}>
					<Route exact path="/me/update" element={<UpdateProfile />} />
				</Route>
				<Route exact path="/password/update" element={<ProtectedRoute />}>
					<Route exact path="/password/update" element={<UpdatePassword />} />
				</Route>
				<Route exact path="/password/forgot" element={<ForgotPassword />} />
				<Route exact path="/password/reset/:token" element={<ResetPassword />} />
				<Route exact path="/cart" element={<Cart />} />
				<Route exact path="/login/shipping" element={<ProtectedRoute />}>
					<Route exact path="/login/shipping" element={<Shipping />} />
				</Route>
				<Route exact path="/order/confirm" element={<ProtectedRoute />}>
					<Route exact path="/order/confirm" element={<Confirm />} />
				</Route>

				{stripeApiKey && (
					<Route exact path="/process/payment" element={<ProtectedRoute />}>
						<Route
							exact
							path="/process/payment"
							element={
								<Elements stripe={loadStripe(stripeApiKey)}>
									<Payment />
								</Elements>
							}
						/>
					</Route>
				)}

				<Route exact path="/success" element={<ProtectedRoute />}>
					<Route exact path="/success" element={<OrderSuccess />} />
				</Route>
				<Route exact path="/orders" element={<ProtectedRoute />}>
					<Route exact path="/orders" element={<MyOrders />} />
				</Route>
				<Route exact path="/order/:id" element={<ProtectedRoute />}>
					<Route exact path="/order/:id" element={<OrderDetails />} />
				</Route>
				<Route exact path="/dashboard" element={<ProtectedRoute isAdmin="true" />}>
					<Route exact path="/dashboard" element={<Dashboard />} />
				</Route>
				<Route
					exact
					path="/admin/products"
					element={<ProtectedRoute isAdmin="true" />}
				>
					<Route exact path="/admin/products" element={<ProductList />} />
				</Route>
				<Route
					exact
					path="/admin/product"
					element={<ProtectedRoute isAdmin="true" />}
				>
					<Route exact path="/admin/product" element={<NewProduct />} />
				</Route>
				<Route
					exact
					path="/admin/product/:id"
					element={<ProtectedRoute isAdmin="true" />}
				>
					<Route exact path="/admin/product/:id" element={<UpdateProduct />} />
				</Route>
				<Route
					exact
					path="/admin/orders"
					element={<ProtectedRoute isAdmin="true" />}
				>
					<Route exact path="/admin/orders" element={<OrderList />} />
				</Route>
			</Routes>
			<Footer />
		</Router>
	);
}

export default App;

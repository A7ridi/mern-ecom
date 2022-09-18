import React, { Fragment, useEffect, useMemo } from "react";
import { CgMouse } from "react-icons/cg";
import { getProducts } from "../../redux/actions/productAction";
import Metadata from "../layout/Metadata";
import "./home.css";
import Product from "./Product";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/loader/Loader";
import { useAlert } from "react-alert";

const Home = () => {
	const dispatch = useDispatch();
	const { loading, error, products, productsCount } = useSelector(
		(state) => state.product
	);
	const alert = useAlert();

	useEffect(() => {
		if (error) return alert.error(error);
		dispatch(getProducts());
	}, [dispatch, error, alert]);
	return (
		<>
			<Metadata title="ECOM - Home" />
			<div className="banner">
				<p>Welcome to ECOM</p>
				<h1>Find Amazing Products Below</h1>

				<a href="#container">
					<button>
						Scroll <CgMouse />
					</button>
				</a>
			</div>

			<h2 className="homeHeading">Featured Products</h2>

			<div className="container" id="container">
				{loading ? (
					<Loader />
				) : (
					products &&
					products.map((product) => (
						<Fragment key={product._id}>
							<Product product={product} />
						</Fragment>
					))
				)}
			</div>
		</>
	);
};

export default Home;

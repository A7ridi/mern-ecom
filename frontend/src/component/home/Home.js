import React from "react";
import { CgMouse } from "react-icons/cg";
import "./home.css";
import Product from "./Product";

const Home = () => {
	return (
		<>
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
				<Product product={""} />
			</div>
		</>
	);
};

export default Home;

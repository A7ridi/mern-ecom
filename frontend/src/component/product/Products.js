import React, { Fragment } from "react";
import "./products.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { clearErrors, getProducts } from "../../redux/actions/productAction";
import { useAlert } from "react-alert";
import Loader from "../layout/loader/Loader";
import Product from "../home/Product";
import { useParams } from "react-router-dom";
import Pagination from "react-js-pagination";
import { useState } from "react";
import Slider from "@material-ui/core/slider";
import Typography from "@material-ui/core/Typography";
import Metadata from "../layout/Metadata";

const categories = [
	"Laptop",
	"Footwear",
	"Bottom",
	"Tops",
	"Attire",
	"Camera",
	"Mobile",
];

const Products = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [price, setPrice] = useState([0, 100000]);
	const [category, setCategory] = useState("");
	const [ratings, setRatings] = useState(0);

	const dispatch = useDispatch();
	const {
		products,
		loading,
		error,
		productsCount,
		resultPerPage,
		filteredProductsCount,
	} = useSelector((state) => state.product);

	const alert = useAlert();
	let { keyword } = useParams();

	const setCurrentPageNo = (e) => {
		setCurrentPage(e);
	};

	const priceHandler = (e, newPrice) => {
		setPrice(newPrice);
	};
	useEffect(() => {
		// if (error) {
		// 	alert.error(error);
		// 	dispatch(clearErrors());
		// }
		window.scrollTo(0, 0);
		dispatch(
			getProducts(keyword, currentPage, price, category.toLowerCase(), ratings)
		);
	}, [dispatch, keyword, currentPage, price, category, ratings]);

	return (
		<Fragment>
			<Metadata title="ECOM - Products" />
			<div className="filterBox">
				<Typography>Price</Typography>
				<Slider
					value={price}
					onChange={priceHandler}
					valueLabelDisplay="auto"
					aria-labelledby="range-slider"
					min={0}
					max={100000}
					aria-label="Default"
				/>

				<Typography>Categories</Typography>
				<ul className="categoryBox">
					{categories.map((category) => (
						<li
							className="category-link"
							key={category}
							onClick={() => setCategory(category)}
						>
							{category}
						</li>
					))}
				</ul>

				<fieldset>
					<Typography component="legend">Ratings</Typography>
					<Slider
						value={ratings}
						onChange={(e, newRating) => {
							setRatings(newRating);
						}}
						aria-labelledby="continuous-slider"
						min={0}
						max={5}
						valueLabelDisplay="auto"
					/>
				</fieldset>
			</div>
			{loading ? (
				<Loader />
			) : (
				<Fragment>
					<h2 className="productsHeading">Products</h2>

					<div className="products">
						{products &&
							products.map((product) => (
								<Product key={product._id} product={product} />
							))}
					</div>

					{resultPerPage < filteredProductsCount && (
						<div className="paginationBox">
							<Pagination
								activePage={currentPage}
								itemsCountPerPage={resultPerPage}
								totalItemsCount={filteredProductsCount}
								onChange={setCurrentPageNo}
								nextPageText="Next"
								prevPageText="Prev"
								firstPageText="First"
								lastPageText="Last"
								itemClass="page-item"
								linkClass="page-link"
								activeClass="pageItemActive"
								activeLinkClass="pageLinkActive"
							/>
						</div>
					)}
				</Fragment>
			)}
		</Fragment>
	);
};

export default Products;

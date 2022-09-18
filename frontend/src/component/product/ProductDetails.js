import React, { Fragment, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import "./productDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { getProductDetails } from "../../redux/actions/productAction";
import { Link, useParams } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import Loader from "../layout/loader/Loader";
import { BiArrowBack } from "react-icons/bi";

const ProductDetails = ({ match }) => {
	const dispatch = useDispatch();
	const { product, loading, error } = useSelector((state) => {
		return state.productDetails;
	});

	const productId = useParams();

	const options = {
		edit: false,
		color: "rgba(20,20,20,0.1)",
		activeColor: "tomato",
		size: window.innerWidth < 600 ? 20 : 25,
		value: product?.ratings,
		isHalf: true,
	};

	useEffect(() => {
		dispatch(getProductDetails(productId.id));
	}, [dispatch, productId.id]);

	return (
		<Fragment>
			{loading ? (
				<Loader />
			) : (
				<>
					<div className="ProductDetails">
						<div className="back-button">
							<Link to="/">
								<button className="back-arrow">
									<BiArrowBack /> Back
								</button>
							</Link>
						</div>
						<div>
							<div>
								<Carousel>
									{product?.images?.map((item, i) => (
										<img
											className="CarouselImage"
											key={item.url}
											src={item.url}
											alt={`${i} Slide`}
										/>
									))}
								</Carousel>
							</div>

							<div>
								<div className="detailsBlock-1">
									<h2>{product?.name}</h2>
									<p>Product #{product?._id}</p>
								</div>
								<div className="detailsBlock-2">
									<ReactStars {...options} />
									<span>({product?.numOfReviews} Reviews)</span>
								</div>

								<div className="detailsBlock-3">
									<h1>$ {product?.price}</h1>
									<div className="detailsBlock-3-1">
										<div className="detailsBlock-3-1-1">
											<button>+</button>
											<input type="number" value="1" />
										</div>
										<button>Add to Cart</button>
									</div>

									<p>
										Status:{" "}
										<b className={product?.stock < 1 ? "redColor" : "greenColor"}>
											{product?.stock < 1 ? "Out of Stock" : "In Stock"}
										</b>
									</p>
								</div>

								<div className="detailsBlock-4">
									Description: <p>{product?.description}</p>
								</div>

								<button className="submitReview">Submit Review</button>
							</div>
						</div>
					</div>
				</>
			)}
		</Fragment>
	);
};

export default ProductDetails;

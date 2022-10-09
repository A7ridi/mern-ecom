import React, { Fragment, useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import "./productDetails.css";
import { useSelector, useDispatch } from "react-redux";
import {
	clearErrors,
	getProductDetails,
	newReview,
} from "../../redux/actions/productAction";
import { Link, useParams } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import Loader from "../layout/loader/Loader";
import { BiArrowBack } from "react-icons/bi";
import ReviewCard from "./ReviewCard";
import { useAlert } from "react-alert";
import Metadata from "../layout/Metadata";
import { addItemsToCart } from "../../redux/actions/cartAction";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Button,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { NEW_REVIEW_RESET } from "../../redux/constants/productConst";

const ProductDetails = ({ match }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [quantity, setQuantity] = useState(1);
	const [open, setOpen] = useState(false);
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");

	const alert = useAlert();

	const dispatch = useDispatch();
	const { product, loading, error } = useSelector((state) => {
		return state.productDetails;
	});
	const { success, error: reviewError } = useSelector(
		(state) => state.newReview
	);
	const { isAuthenticated } = useSelector((state) => state.user);

	const productId = useParams();

	const increaseQuantity = () => {
		if (product.stock <= quantity) {
			return alert.error("You cannot add this item more!");
		}
		setQuantity(quantity + 1);
	};
	const decreaseQuantity = () => {
		if (quantity <= 1) return;
		else setQuantity(quantity - 1);
	};

	const addToCart = () => {
		if (product.stock < 1) {
			return alert.error("Oops! Item is out of stock.");
		} else alert.success("This item is added to cart.");
		return dispatch(addItemsToCart(productId.id, quantity));
	};

	useEffect(() => {
		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}
		if (reviewError) {
			alert.error(reviewError);
			dispatch(clearErrors());
		}
		if (success) {
			alert.success("Review Submitted Successfully");
			dispatch({ type: NEW_REVIEW_RESET });
		}
		window.scrollTo(0, 0);
		dispatch(getProductDetails(productId.id));
		loader();
	}, [dispatch, productId.id, error, alert, reviewError, success]);

	const loader = () =>
		setTimeout(() => {
			setIsLoading(false);
		}, 100);

	const submitReviewToggle = () => {
		if (!isAuthenticated) {
			alert.error("Please login to review product!");
			dispatch(clearErrors());
		} else {
			open ? setOpen(false) : setOpen(true);
		}
	};

	const reviewSubmitHandler = () => {
		const myForm = new FormData();

		myForm.set("rating", rating);
		myForm.set("comment", comment);
		myForm.set("productId", productId.id);

		dispatch(newReview(myForm));

		setOpen(false);
	};

	return (
		<Fragment>
			<Metadata title={`ECOM - ${product?.name}`} />
			{isLoading ? (
				<Loader />
			) : (
				<Fragment>
					<div className="ProductDetails">
						<div className="back-button">
							<Link to="/">
								<button className="back-arrow">
									<BiArrowBack /> Back
								</button>
							</Link>
						</div>
						<div className="product-details">
							<div className="product-image">
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

							<div className="product-details-block">
								<div className="detailsBlock-1">
									<h2>{product?.name}</h2>
									<p>Product #{product?._id}</p>
								</div>
								<div className="detailsBlock-2">
									<Rating
										value={product?.ratings}
										size="medium"
										precision={0.5}
										readOnly
									/>
									<span>({product?.numOfReviews} Reviews)</span>
								</div>

								<div className="detailsBlock-3">
									<h1>$ {product?.price}</h1>
									<div className="detailsBlock-3-1">
										<div className="detailsBlock-3-1-1">
											<button onClick={decreaseQuantity}>-</button>
											<span style={{ marginLeft: "10px", marginRight: "10px" }}>
												{quantity}
											</span>
											<button onClick={increaseQuantity}>+</button>
										</div>
										<button
											// disabled={product?.stock < 1 ? true : false}
											onClick={addToCart}
										>
											Add to Cart
										</button>
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

								<button className="submitReview" onClick={submitReviewToggle}>
									Submit Review
								</button>
							</div>
						</div>
					</div>
				</Fragment>
			)}

			<h3 className="reviewsHeading">Reviews</h3>

			<Dialog
				aria-labelledby="simple-dialog-title"
				open={open}
				onClose={submitReviewToggle}
			>
				<DialogTitle>Submit Review</DialogTitle>
				<DialogContent className="submitDialog">
					<Rating
						onChange={(e) => setRating(e.target.value)}
						value={rating}
						size="large"
						precision={0.5}
					/>

					<textarea
						className="submitDialogTextArea"
						cols="30"
						rows="5"
						value={comment}
						onChange={(e) => setComment(e.target.value)}
					></textarea>
				</DialogContent>
				<DialogActions>
					<Button onClick={submitReviewToggle} color="secondary">
						Cancel
					</Button>
					<Button onClick={reviewSubmitHandler} color="primary">
						Submit
					</Button>
				</DialogActions>
			</Dialog>

			{product?.reviews && product?.reviews[0] ? (
				<div className="reviews">
					{product.reviews.map((review, i) => {
						return <ReviewCard review={review} key={i} />;
					})}
				</div>
			) : (
				<p className="noReviews">No Reviews Yet</p>
			)}
		</Fragment>
	);
};

export default ProductDetails;

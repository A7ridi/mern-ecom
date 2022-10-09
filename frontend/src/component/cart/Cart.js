import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItemsToCart } from "../../redux/actions/cartAction";
import "./cart.css";
import CartItemCard from "./CartItemCard";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { Link, useNavigate } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { useAlert } from "react-alert";
import Metadata from "../layout/Metadata";

const Cart = () => {
	const navigate = useNavigate();
	const alert = useAlert();
	const dispatch = useDispatch();
	const { cartItems } = useSelector((state) => state.cart);

	const increaseQuantity = (id, quantity, stock) => {
		const newQty = quantity + 1;
		if (stock <= quantity) {
			return alert.error("You cannot add this item more!");
		}
		dispatch(addItemsToCart(id, newQty));
	};

	const decreaseQuantity = (id, quantity) => {
		const newQty = quantity - 1;
		if (quantity <= 1) return;
		dispatch(addItemsToCart(id, newQty));
	};

	const grossTotal = cartItems.reduce(
		(acc, item) => acc + item.quantity * item.price,
		0
	);

	const checkOutHandler = () => {
		navigate("/login?redirect=shipping");
	};

	return (
		<Fragment>
			<Metadata title="Cart - ECOM" />
			{cartItems.length === 0 ? (
				<div className="emptyCart">
					<RemoveShoppingCartIcon />
					<Typography>No items in your cart</Typography>
					<Link to="/products">View Products</Link>
				</div>
			) : (
				<Fragment>
					<div className="cartPage">
						<div className="cartHeader">
							<p>Product</p>
							<p>Quantity</p>
							<p>Subtotal</p>
						</div>

						{cartItems &&
							cartItems.map((item) => (
								<div className="cartContainer">
									<CartItemCard item={item} key={item.product} />
									<div className="cartInput">
										<button onClick={() => decreaseQuantity(item.product, item.quantity)}>
											-
										</button>
										<input type="number" value={item.quantity} readOnly />
										<button
											onClick={() =>
												increaseQuantity(item.product, item.quantity, item.stock)
											}
										>
											+
										</button>
									</div>
									<p className="cartSubtotal">{`$ ${item.price * item.quantity}`}</p>
								</div>
							))}

						<div className="cartGrossProfit">
							<div></div>
							<div className="cartGrossProfitBox">
								<p>Gross Total</p>
								<p>$ {grossTotal}</p>
							</div>
							<div></div>
							<div className="checkOutBtn">
								<button onClick={checkOutHandler}>Check Out</button>
							</div>
						</div>
					</div>
				</Fragment>
			)}
		</Fragment>
	);
};

export default Cart;

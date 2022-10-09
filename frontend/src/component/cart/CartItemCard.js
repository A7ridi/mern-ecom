import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeItemsFromCart } from "../../redux/actions/cartAction";
import "./cartItemCard.css";

const CartItemCard = ({ item }) => {
	const dispatch = useDispatch();
	return (
		<div className="CartItemCard">
			<Link to={`/product/${item.product}`}>
				<img src={item.image} alt={item.name} width="100px" />
			</Link>
			<div>
				<Link to={`/product/${item.product}`}>{item.name}</Link>
				<span>{`Price: $ ${item.price}`}</span>
				<p onClick={() => dispatch(removeItemsFromCart(item.product))}>Remove</p>
			</div>
		</div>
	);
};

export default CartItemCard;

import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
	newProductReducer,
	newReviewReducer,
	productDetailsReducer,
	productReducer,
	productReviewsReducer,
	reviewReducer,
	singleProductReducer,
} from "./redux/reducers/productReducer";
import {
	allUsersReducer,
	forgotPasswordReducer,
	profileReducer,
	userDetailsReducer,
	userReducer,
} from "./redux/reducers/userReducer";
import { cartReducer } from "./redux/reducers/cartReducer";
import {
	allOrdersReducer,
	myOrdersReducer,
	newOrderReducer,
	orderDetailsReducer,
	orderReducer,
} from "./redux/reducers/orderReducer";

const reducer = combineReducers({
	product: productReducer,
	productDetails: productDetailsReducer,
	user: userReducer,
	profile: profileReducer,
	forgotPassword: forgotPasswordReducer,
	cart: cartReducer,
	newOrder: newOrderReducer,
	order: orderReducer,
	allOrders: allOrdersReducer,
	myOrders: myOrdersReducer,
	orderDetails: orderDetailsReducer,
	newReview: newReviewReducer,
	newProduct: newProductReducer,
	singleProduct: singleProductReducer,
	allUsers: allUsersReducer,
	userDetails: userDetailsReducer,
	productReviews: productReviewsReducer,
	review: reviewReducer,
});

const initialState = {
	cart: {
		cartItems: localStorage.getItem("cartItems")
			? JSON.parse(localStorage.getItem("cartItems"))
			: [],
		shippingInfo: localStorage.getItem("shippingInfo")
			? JSON.parse(localStorage.getItem("shippingInfo"))
			: [],
	},
};

const middleware = [thunk];

const store = createStore(
	reducer,
	initialState,
	composeWithDevTools(applyMiddleware(...middleware))
);

export default store;

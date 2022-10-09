import { Rating } from "@material-ui/lab";
import React from "react";
import UserDP from "../../images/user.png";

const ReviewCard = ({ review }) => {
	return (
		<div className="reviewCard">
			<img src={UserDP} alt="User" />
			<h5>{review.name}</h5>
			<Rating value={review?.rating} size="medium" precision={0.5} readOnly />
			<span>{review.comment}</span>
		</div>
	);
};

export default ReviewCard;

import React, { Fragment } from "react";
import { useState } from "react";
import "./search.css";
import { useNavigate } from "react-router-dom";
import Metadata from "../layout/Metadata";

const Search = ({ history }) => {
	const [keyword, setKeyword] = useState("");
	let navigate = useNavigate();

	const searchSubmitHandler = (e) => {
		e.preventDefault();
		if (keyword.trim()) {
			navigate(`/products/${keyword}`);
		} else {
			navigate("/products");
		}
	};
	return (
		<Fragment>
			<Metadata title={`ECOM - Search Products`} />
			<form className="searchBox" onSubmit={searchSubmitHandler}>
				<input
					type="text"
					placeholder="Search products"
					value={keyword}
					onChange={(e) => setKeyword(e.target.value)}
				/>
				<input type="submit" value="Search" />
			</form>
		</Fragment>
	);
};

export default Search;

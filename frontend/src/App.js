import "./App.css";
import Header from "./component/layout/header/Header";
import Footer from "./component/layout/footer/Footer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WebFont from "webfontloader";
import { useEffect } from "react";
import Home from "./component/home/Home";
import ProductDetails from "./component/product/ProductDetails.js";

function App() {
	useEffect(() => {
		WebFont.load({
			google: {
				families: ["Roboto", "Drold Sans", "Chilanka"],
			},
		});
	}, []);
	return (
		<Router>
			<Header />
			<Routes>
				<Route exact path="/" element={<Home />} />
				<Route exact path="/product/:id" element={<ProductDetails />} />
			</Routes>
			<Footer />
		</Router>
	);
}

export default App;

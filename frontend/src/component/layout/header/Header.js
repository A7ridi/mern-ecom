import React from "react";
import { ReactNavbar } from "overlay-navbar";
import { FiShoppingCart } from "react-icons/fi";
import { BsSearch } from "react-icons/bs";
import { BiUser } from "react-icons/bi";

const options = {
	burgerColor: "#eb4034",
	burgerColorHover: "#a62d24",
	logo:
		"https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-suite-everything-you-need-know-about-google-newest-0.png",
	logoWidth: "10vmax",
	navColor1: "white",
	logoHoverSize: "10px",
	logoHoverColor: "#eb4034",
	link1Text: "Home",
	link2Text: "Product",
	link3Text: "Contact",
	link4Text: "About",
	link1Url: "/",
	link2Url: "/product",
	link3Url: "/contact",
	link4Url: "/about",
	link1Size: "1.2vmax",
	link1Color: "rgba(35,35, 35, 0.8)",
	nav1justifyContent: "flex-end",
	nav2justifyContent: "flex-end",
	nav3justifyContent: "flex-start",
	nav4justifyContent: "flex-start",
	link1ColorHover: "#eb4034",
	link2ColorHover: "#eb4034",
	link3ColorHover: "#eb4034",
	link4ColorHover: "#eb4034",
	link1Margin: "1vmax",
	profileIconColor: "rgba(35,35,35, 0.8)",
	searchIconColor: "rgba(35,35,35, 0.8)",
	cartIconColor: "rgba(35,35,35, 0.8)",
	profileIconColorHover: "#eb4034",
	searchIconColorHover: "#eb4034",
	cartIconColorHover: "#eb4034",
	cartIconMargin: "1vmax",
	searchIcon: true,
	cartIcon: true,
	profileIcon: true,
	SearchIconElement: BsSearch,
	CartIconElement: FiShoppingCart,
	ProfileIconElement: BiUser,
	searchIconUrl: "/search",
	cartIconUrl: "/cart",
	profileIconUrl: "/account",
};

const Header = () => {
	return <ReactNavbar {...options} />;
};

export default Header;

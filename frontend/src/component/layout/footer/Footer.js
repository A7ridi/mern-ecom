import React from "react";
import { IoLogoGooglePlaystore } from "react-icons/io5";
import { AiOutlineApple } from "react-icons/ai";
import { getCurrentYear } from "../../../actions/helper";
import "./footer.css";

const Footer = () => {
	return (
		<footer id="footer">
			<div className="leftFooter">
				<h4>Download Our App</h4>
				<p>Download App for Android and IOS mobile phone</p>
				<div className="icon-flex">
					<a href="https://google.com">
						<IoLogoGooglePlaystore size={70} />
					</a>
					<a href="https://apple.com">
						<AiOutlineApple size={70} />
					</a>
				</div>
			</div>

			<div className="midFooter">
				<h1>ECOM</h1>
				<p>High Quality is our first priority</p>

				<p>Copyright {getCurrentYear()} &copy; ECOM</p>
			</div>

			<div className="rightFooter">
				<h4>Follow us</h4>
				<a href="https://facebook.com">Faceook</a>
				<a href="https://twitter.com">Twitter</a>
				<a href="https://instagram.com">Instagram</a>
			</div>
		</footer>
	);
};

export default Footer;

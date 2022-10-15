import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import InstagramIcon from "@material-ui/icons/Instagram";
const About = () => {
	const visitWeb = () => {
		window.location = "https://afridi.vercel.app/";
	};
	return (
		<div className="aboutSection">
			<div></div>
			<div className="aboutSectionGradient"></div>
			<div className="aboutSectionContainer">
				<Typography component="h1">About Us</Typography>

				<div>
					<div>
						<Avatar
							style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
							src="https://media-exp1.licdn.com/dms/image/C4D03AQHnqDBXOLD2GQ/profile-displayphoto-shrink_800_800/0/1649840822305?e=1671062400&v=beta&t=25NHZ_VcfdBIeE2T0G0K-5G2A19NHNQ8JgYW-w36m9k"
							alt="Founder"
						/>
						<Typography>Afridi Ahmed</Typography>
						<Button onClick={visitWeb} color="primary">
							Visit Website
						</Button>
						<span>This is a sample wesbite made by ECOM.</span>
					</div>
					<div className="aboutSectionContainer2">
						<Typography component="h2">Our Brands</Typography>
						<a href="https://www.linkedin.com/in/afridiahmed/" target="blank">
							<LinkedInIcon className="youtubeSvgIcon" />
						</a>

						<a href="https://instagram.com/afridiiahmed" target="blank">
							<InstagramIcon className="instagramSvgIcon" />
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default About;

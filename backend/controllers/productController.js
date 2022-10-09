const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandlers");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");

// create product - Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
	let images = [];

	if (typeof req.body.images === "string") {
		images.push(req.body.images);
	} else {
		images = req.body.images;
	}

	const imagesLinks = [];

	for (let i = 0; i < images.length; i++) {
		const result = await cloudinary.v2.uploader.upload(images[i], {
			folder: "products",
		});

		imagesLinks.push({
			public_id: result.public_id,
			url: result.secure_url,
		});
	}

	req.body.images = imagesLinks;
	req.body.user = req.user.id;

	const products = await Product.create(req.body);

	res.status(201).json({
		success: true,
		products,
	});
});

// get products
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
	const resultPerPage = 8;
	const productCount = await Product.countDocuments();
	const apiFeatures = new ApiFeatures(Product.find(), req.query)
		.search()
		.filter();

	let product = await apiFeatures.query;
	let filteredProductsCount = product.length;
	apiFeatures.pagination(resultPerPage);
	product = await apiFeatures.query.clone();

	res.status(200).json({
		success: true,
		product,
		productCount,
		resultPerPage,
		filteredProductsCount,
	});
});

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
	const products = await Product.find();

	res.status(200).json({
		success: true,
		products,
	});
});

// get product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
	let product = await Product.findById(req.params.id);

	// if (!product) {
	//   return res.status(500).json({
	//     success: false,
	//     message: "Product not found",
	//   });
	// }
	if (!product) {
		return next(new ErrorHandler("Product not found", 404));
	}

	res.status(200).json({
		success: true,
		product,
	});
});

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
	let product = await Product.findById(req.params.id);

	if (!product) {
		return next(new ErrorHandler("Product not found", 404));
	}

	// Images Start Here
	let images = [];

	if (typeof req.body.images === "string") {
		images.push(req.body.images);
	} else {
		images = req.body.images;
	}

	if (images !== undefined) {
		// Deleting Images From Cloudinary
		for (let i = 0; i < product.images.length; i++) {
			await cloudinary.v2.uploader.destroy(product.images[i].public_id);
		}

		const imagesLinks = [];

		for (let i = 0; i < images.length; i++) {
			const result = await cloudinary.v2.uploader.upload(images[i], {
				folder: "products",
			});

			imagesLinks.push({
				public_id: result.public_id,
				url: result.secure_url,
			});
		}

		req.body.images = imagesLinks;
	}

	product = await Product.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
		useFindAndModify: true,
	});

	res.status(200).json({
		success: true,
		product,
	});
});

// delete product
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
	let product = await Product.findById(req.params.id);

	if (!product) {
		return next(new ErrorHandler("Product not found", 404));
	}

	// Deleting Images From Cloudinary
	for (let i = 0; i < product.images.length; i++) {
		await cloudinary.v2.uploader.destroy(product.images[i].public_id);
	}

	await product.remove();

	res.status(200).json({
		success: true,
		message: "Product deleted successfully",
	});
});

// create or update review
exports.createUpdateReview = catchAsyncErrors(async (req, res, next) => {
	const { rating, comment, productId } = req.body;

	const review = {
		user: req.user._id,
		name: req.user.name,
		rating: Number(rating),
		comment,
	};

	const product = await Product.findById(productId);

	const isReviewed = product.reviews.find(
		(rev) => rev.user.toString() === req.user._id.toString()
	);

	if (isReviewed) {
		product.reviews.forEach((rev) => {
			if (rev.user.toString() === req.user._id.toString()) {
				rev.rating = rating;
				rev.comment = comment;
			}
		});
	} else {
		product.reviews.push(review);
		product.numOfReviews = product.reviews.length;
	}

	let avg = 0;

	product.reviews.forEach((rev) => {
		avg += rev.rating;
	});

	product.ratings = avg / product.reviews.length;

	await product.save({ validateBeforeSave: false });

	res.status(200).json({
		success: true,
	});
});

// get product review
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
	const product = await Product.findById(req.query.id);

	if (!product) {
		return next(new ErrorHandler("Product not found", 404));
	}

	res.status(200).json({
		success: true,
		reviews: product.reviews,
	});
});

// delete review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
	const product = await Product.findById(req.query.productId);

	if (!product) {
		return next(new ErrorHandler("Product not found", 404));
	}

	const reviews = product.reviews.filter(
		(rev) => rev._id.toString() !== req.query.id.toString()
	);

	let avg = 0;

	reviews.forEach((rev) => {
		avg += rev.rating;
	});

	const validateRatings = avg / reviews.length;
	const ratings = isNaN(validateRatings) ? 0 : validateRatings;

	const numOfReviews = reviews.length;

	await Product.findByIdAndUpdate(
		req.query.productId,
		{ ratings: Number(ratings), reviews, numOfReviews },
		{
			new: true,
			runValidators: true,
			useFindAndModify: false,
		}
	);

	res.status(200).json({
		success: true,
	});
});

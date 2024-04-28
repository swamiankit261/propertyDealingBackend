const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const Property = require("../models/property.modle");

exports.registerProperty = asyncHandler(async (req, res) => {
    const { price, posted, propertyType, propertyCategory, address, rentOrSell, areaUnit, saleType, landlord, description } = req.body;

    posted.by = req.user._id;

    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    };

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const image = await cloudinary.v2.uploader.upload(images[i], { folder: "Property" });
        imagesLinks.push({
            public_id: image.public_id,
            url: image.secure_url,
        });
    }

    // req.body.images = imagesLinks;

    const Fields = {
        images: imagesLinks,
        price: price,
        posted: posted,
        propertyType: propertyType,
        propertyCategory: propertyCategory,
        address: address,
        rentOrSell: rentOrSell,
        areaUnit: areaUnit,
        saleType: saleType,
        landlord: landlord,
        description: description
    }

    const newProperty = new Property(Fields);
    const property = await newProperty.save();

    res.status(201).json(new ApiResponse(201, "Property created successfully", property));
})
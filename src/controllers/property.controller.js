const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const Property = require("../models/property.modle");
const { validationResult } = require("express-validator");
const cloudinary = require("cloudinary");


// Create a new property
exports.registerProperty = asyncHandler(async (req, res) => {

    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.status(400).send({ errors: result.array() });
    }
    const { price, postedAt, propertyType, propertyCategory, address, rentOrSell, areaUnit, saleType, landlord, description } = req.body;
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


    const Fields = {
        images: imagesLinks,
        price: price,
        posted: {
            at: postedAt,
            by: req.user._id
        },
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


    res.status(201).json(new ApiResponse(201, property, "Property created successfully"));
});

// Get single property
exports.getSingleProperty = asyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.id);

    if (!property) {
        throw new ApiError(404, "Property not found");
    }

    res.status(200).json(new ApiResponse(200, property, "Property found"));
});


exports.updateProperty = asyncHandler(async (req, res) => {

    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.status(400).send({ errors: result.array() });
    }

    const property = await Property.findById({ _id: req.params.id });

    if (!property) {
        throw new ApiError(404, "Property not found");
    }

    if (!property.posted.by.equals(user.id)) {
        throw new ApiError(403, "you are not allowed to update this property")
    }

    let images = [];
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    };


    if (images !== undefined) {

        for (let i = 0; i < property.images.length; i++) {
            await cloudinary.v2.uploader.destroy(property.images[i].public_id);
        }

        const imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const image = await cloudinary.v2.uploader.upload(images[i], { folder: "Property" });
            imagesLinks.push({
                public_id: image.public_id,
                url: image.secure_url,
            });
            req.body.images = imagesLinks;
        }
    }

    req.body.posted.at = req.body.postedAt;

    delete req.body.postedAt;

    const updatedPropertie = await Property.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });

    res.status(200).json(new ApiResponse(200, updatedPropertie, "Property updated successfully"));

});


exports.deleteProperty = asyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.id);

    if (!property) {
        throw new ApiError(404, "Property not found");
    }

    for (let i = 0; i < property.images.length; i++) {
        await cloudinary.v2.uploader.destroy(property.images[i].public_id);
    }

    const result = await Property.findByIdAndDelete(req.params.id);

    if (result.deletedCount === 0) {
        throw new ApiError(404, "Property note deleted")
    }

    res.status(200).json(new ApiResponse(200, {}, "Property deleted successfully"));
})
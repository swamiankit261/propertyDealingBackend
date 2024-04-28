const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
    street: String,

    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zipCode: {
        type: String,
        index: true,
        required: true,
        minlength: 5,
        match: [/^[0-9]+$/, 'Please enter a valid zip/pin code']
    }
})

const propertySchema = new mongoose.Schema(
    {
        images: [
            {
                public_id: {
                    type: String,
                    required: true
                },
                url: {
                    type: String,
                    required: true
                }
            }
        ],
        price: {
            type: Number,
            required: true
        },
        // Information about who posted the property
        posted: {
            at: {
                type: String,
                required: true,
                enum: ["Owner", "Builder", "Dealer"]
            },
            by: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        },
        // Type of the property (e.g., residential, commercial)
        propertyType: {
            type: String,
            required: true,
            enum: ["Residential", "Commercial"]
        },
        // Category of the property (e.g., house, apartment, office)
        propertyCategory: {
            type: String,
            required: true,
        },
        // Address of the property
        address: {
            type: addressSchema,
            required: true,
        },
        rentOrSell: {
            type: String,
            required: true,
            enum: ["rent", "sell"]
        },
        // Unit of measurement for the area of the property
        areaUnit: {
            type: Number,
            required: true
        },
        saleType: {
            type: String,
            required: true,
            enum: ["firsthand", "secondhand"]
        },
        // Name of the landlord
        landlord: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;

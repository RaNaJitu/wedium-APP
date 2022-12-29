const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        trim: true,
        required: [true, 'Please add a category_name '],
        maxlength: 32,
    },
    category_image: {
        type: String,
        required: [true, 'Please add a category_image '],
    },
    category_banner_image: {
        type: String,
        required: [true, 'Please add a category_banner_image '],
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'INACTIVE'
    },
    displayOrder: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

// module.exports = mongoose.model("Category", categorySchema);
//we need to create collection
const Category = mongoose.model('Category', categorySchema );

module.exports = Category;
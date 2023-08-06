const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    if (req.app.locals.is_production === "development") {
        require('dotenv').config();
    }

    // -- SDK initialization for imagekit --
    var ImageKit = require("imagekit");
    var imagekit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: "https://ik.imagekit.io/smec"
    });

    let imageURLS = [];

    // Fetch images with "bishop" tag
    imagekit.listFiles({
        searchQuery: 'tags IN ["bishop"]'
    }, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Error occurred while fetching images.');
        }

        const imageData = result;
        imageData.forEach(image => {
            imageURLS.push(image.url);
        });

        // Fetch images without "bishop" tag
        imagekit.listFiles({
            searchQuery: 'tags IN ["old_pics"]'
        }, (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Error occurred while fetching images.');
            }

            const imageData = result;
            imageData.forEach(image => {
                imageURLS.push(image.url);
            });

            console.log(imageURLS);
            res.render('gallery', { image_links: imageURLS });
        });
    });
});

module.exports = router;

var express = require('express');
var router = express.Router();
var genDates = require('./genDates')
var ImageKit = require("imagekit");

/* GET home page. */
router.get('/', async function (req, res, next) {
    const query = 'SELECT * FROM service_dates WHERE status = 1';
    req.pool.query(query, async (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Database error");
        }

        let years_set = new Set();
        result.forEach(row => {
            years_set.add(new Date(row.date).getFullYear());
        });

        let dates = {};

        for (const year of years_set) {
            dates[year] = {
                "January": await genDates("January", req.pool, year),
                "February": await genDates("February", req.pool, year),
                "March": await genDates("March", req.pool, year),
                "April": await genDates("April", req.pool, year),
                "May": await genDates("May", req.pool, year),
                "June": await genDates("June", req.pool, year),
                "July": await genDates("July", req.pool, year),
                "August": await genDates("August", req.pool, year),
                "September": await genDates("September", req.pool, year),
                "October": await genDates("October", req.pool, year),
                "November": await genDates("November", req.pool, year),
                "December": await genDates("December", req.pool, year)
            }
        }

        // console.log(dates);
        res.render('readings', { dates: dates });
    });
});

router.get('/:date/view', (req, res, next) => {

    // -- SDK initialization for imagekit --

    var imagekit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: "https://ik.imagekit.io/smec"
    });

    imagekit.listFiles({
        path: `/smec_readings/${req.params.date}`,
        limit: 5
    }, function (error, readings) {
        if (error) {
            console.log(error)
            res.render('error')
        } else {
            console.log(readings)

            let query = `SELECT pamphlet_link FROM service_dates WHERE date = '${req.params.date}'`
            req.pool.query(query, (err, result) => {
                if (err) {
                    console.log(err)
                    res.render('error')
                }
                if (result.length == 0) {
                    res.render('error')
                } else {
                    console.log(result)
                    res.render('readingonerec', { date_id: new Date(req.params.date.replace("-", "/")).toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" }), pamphlet_link: result[0].pamphlet_link, gospelData: { FR: readings[0].url, SR: readings[2].url, Pm: readings[1].url, GP: readings[3].url } })
                }
            });;

        }
    });

});



module.exports = router;

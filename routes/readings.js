var express = require('express');
var router = express.Router();
var genDates = require('./genDates')

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
    res.render('readingonerec')
});

module.exports = router;

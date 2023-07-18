const express = require('express');
const router = express.Router();

router.get('/:email', (req, res, next) => {
    let demail = Buffer.from(req.params.email, 'base64').toString();
    req.pool.query('DELETE FROM smec_email WHERE email = ' + `"${demail}"`, (err, results) => {
        if (err) {
            console.log(err);
            res.render('unsubscribe', { error: demail });
        } else if (results.affectedRows === 0) {
            console.log(results.affectedRows);
            res.render('unsubscribe', { invalid: demail });
        } else {
            console.log(results.affectedRows);
            res.render('unsubscribe', { success: demail });
        }
    });

});



module.exports = router;
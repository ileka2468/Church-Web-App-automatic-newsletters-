let month_to_number = {
    "January": 1,
    "February": 2,
    "March": 3,
    "April": 4,
    "May": 5,
    "June": 6,
    "July": 7,
    "August": 8,
    "September": 9,
    "October": 10,
    "November": 11,
    "December": 12
}

let returnDate = (monthToQuery, pool, year) => {
    let target_month = month_to_number[monthToQuery];
    let days_in_month = new Date(year, target_month, 0).getDate();

    const query = `SELECT * FROM service_dates WHERE date BETWEEN '${year}-${target_month}-1' AND '${year}-${target_month}-${days_in_month}' AND status = 1`;

    return new Promise((resolve, reject) => {
        pool.query(query, (err, results) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve(results);
        });
    }).then((value) => {
        // console.log(value);
        return value;  // This is the important change.
    }).catch((err) => {
        console.log(err);
    });
}


module.exports = returnDate;

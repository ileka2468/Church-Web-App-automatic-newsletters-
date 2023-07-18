// require('dotenv').config();
const mysql = require('mysql');
const fs = require('fs');
const sgMail = require('@sendgrid/mail');

const conn = mysql.createConnection({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD
});




sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const today = new Date();
const month = today.getMonth() + 1;
const day = today.getDate();

const sendEmail = (msg) => {
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent');
        })
        .catch((error) => {
            console.error(error);
        })
}

const getMailList = () => {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM smec_email"
        conn.query(query, (err, result) => {
            if (err) {
                conn.end()
                reject(err);
            }

            conn.end();
            resolve(result);
        });
    });

}

if (day === 1) {
    const mailList = [];
    getMailList()
        .then((data) => {
            console.log(data);
            data.forEach(row => {
                mailList.push(row.email);
            });

            mailList.forEach(email => {

                const encoded = Buffer.from(email).toString('base64');
                console.log(encoded);

                let htmlString = fs.readFileSync(`newsletter/emails/${month}.ejs`).toString();

                let stringToAdd = "/" + encoded;
                let linkPos = htmlString.indexOf('/unsubscribe') + 12;


                let newString = htmlString.slice(0, linkPos)
                    + stringToAdd
                    + htmlString.slice(linkPos);

                let msg = {
                    to: `${email}`,
                    from: {
                        name: 'St. Margaret\'s Episcopal Church',
                        email: 'newsletter@stmargaretschicago.org',
                    },
                    subject: 'Check out the latest Newsletter from St. Margaret\'s Episcopal Church.',
                    html: newString
                }

                sendEmail(msg);
            });

            console.log(`Newsletter for the month of ${month} sent to all addresses succesfuly.`)

        }).catch((err) => {
            console.log(err)
        });


} else {
    console.log(`Scheduled Script Ran: Status - Not the 1st of the month | Run time = ${new Date().toLocaleDateString()}`)
}











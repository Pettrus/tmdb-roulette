//import * as functions from "firebase-functions";
//import { Genre } from './movies/movie-types';
//import { getMoviesRoulette } from './movies/movies';
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    },
    logger: true,
    debug: true,
    secure: true,
    secureConnection: false,
    tls:{
        rejectUnAuthorized:true
    }
});

const teste = async () => {
    console.log('enviar email')
    const mailOptions = {
        from: 'oracle.bot1@gmail.com', // Something like: Jane Doe <janedoe@gmail.com>
        to: 'pettrus.sherlock@gmail.com',
        subject: 'Hello from firebase', // email subject
        html: 'EMAIL SIMPLES'
    };

    console.log('agora vai')

    transporter.sendMail(mailOptions, function(error: any, info: any){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

    console.log('enviou')

    // returning result
    /*return transporter.sendMail(mailOptions, (erro: any, info: any) => {
        if(erro){
            console.log('erro')
        }

        console.log('eniado')
    });*/
}

teste()

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
//export const helloWorld = functions.https.onRequest((request, response) => {
    /*const mailOptions = {
        from: 'orable.bot1@gmail.com', // Something like: Jane Doe <janedoe@gmail.com>
        to: 'pettrus.sherlock@gmail.com',
        subject: 'Hello from firebase', // email subject
        html: `<p style="font-size: 16px;">test it!!</p>
            <br />
        ` // email content in HTML
    };

    // returning result
    return transporter.sendMail(mailOptions, (erro: any, info: any) => {
        if(erro){
            return res.send(erro.toString());
        }
        return res.send('Sended');
    });*/

    //functions.logger.info("Hello logs!", {structuredData: true});
    //response.send("Hello from Firebase!");
//});

/*exports.sortMovies = functions
  .pubsub.schedule('0 18 * * *')
  .timeZone('Europe/Lisbon')
  .onRun(async (ctx) => {
    console.log('This will run M-F at 10:00 AM Eastern!');

    const moviesGenre = [
        Genre.Adventure,
        Genre.Fantasy,
        Genre.SciFi,
        Genre.Mystery
    ];

    const movies = await getMoviesRoulette(moviesGenre);
});*/
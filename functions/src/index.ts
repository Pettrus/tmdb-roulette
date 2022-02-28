import * as functions from "firebase-functions";
import { Genre } from "./movies/movie-types";
import { getMoviesRoulette } from "./movies/movies";
import { emailTemplate } from "./email/template";

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  logger: true,
  debug: true,
  secure: true,
  secureConnection: false,
  tls: {
    rejectUnAuthorized: true,
  },
});

const getMoviesHtml = async () => {
  const moviesGenre = [
    Genre.Adventure,
    Genre.Fantasy,
    Genre.SciFi,
    Genre.Mystery,
  ];

  const moviesByGenre = await getMoviesRoulette(moviesGenre);
  const moviesHtml = moviesByGenre
    .map((movieByGenre) => {
      return `
        <h2>${movieByGenre.genre}</h2>
        <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
            <tr>                
                ${movieByGenre.list
                  .map((movie: any) => {
                    const url = encodeURI(
                      `https://www.youtube.com/results?search_query=${movie.title} trailer`
                    );

                    return `
                        <td width="200" class="mobile" style="font-size:12px; line-height:18px;">
                            <div style="text-align: center">
                                <a href="${url}" target="_blank">
                                    <img src="https://image.tmdb.org/t/p/original/${movie.poster_path}" style="width:100px;height:150px;object-fit: cover;" />
                                </a>
                                <p style="text-align: center;">${movie.title}</p>
                            </div>
                        </td>
                    `;
                  })
                  .join("")}
            </tr>
        </table>
    `;
    })
    .join("");

  return moviesHtml;
};

/*export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});*/

export const sortMovies = functions.pubsub
  .schedule("0 18 * * 0-6")
  .timeZone("Europe/Lisbon")
  .onRun(async (ctx: any) => {
    const htmlTemplate = emailTemplate;
    const moviesHtml = await getMoviesHtml();
    const htmlEmail = htmlTemplate.replace("#REPLACE#", moviesHtml);

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: ["pettrus.sherlock@gmail.com", "ilanavsbnu@gmail.com"],
      subject: "Today's movie roulette :)",
      html: htmlEmail,
    };

    transporter.sendMail(mailOptions, function (error: any, info: any) {
      if (error) {
        console.log(error);
        functions.logger.error(error, { structuredData: true });
      } else {
        console.log("Email sent: " + info.response);
        functions.logger.info("Email sent: " + info.response, {
          structuredData: true,
        });
      }
    });
  });

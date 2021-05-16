const sendgrid = require("@sendgrid/mail");
const Mailgen = require("mailgen");
require("dotenv").config();

class MailgenService {
  #sender = sendgrid;
  #GenerateTemplate = Mailgen;

  constructor(env) {
    switch (env) {
      case "development":
        this.link = "http://localhost:4040";
        break;
      case "production":
        this.link = "link for production";
        break;
      default:
        this.link = "http://localhost:4040";
        break;
    }
  }

  #createLetterTemplate(verificationToken) {
    const mailGenerator = new this.#GenerateTemplate({
      theme: "cerberus",
      product: {
        name: "Phonebook",
        link: this.link,
      },
    });
    const letter = {
      body: {
        name: "Anastasia",
        intro:
          "Welcome to your Phonebook! We're very excited to have you on board.",
        action: {
          instructions: "To verify your Email, please click here:",
          button: {
            color: "#cd00cd", // Optional action button color
            text: "Confirm your account",
            link: `${this.link}/api/users/verify/${verificationToken}`,
          },
        },
        outro: "༼ つ ◕_◕ ༽つ",
      },
    };

    return mailGenerator.generate(letter);
  }

  async sendVerificationLetter(verificationToken, email) {
    this.#sender.setApiKey(process.env.SENDGRID_API_KEY);
    console.log(email);
    const msg = {
      to: email,
      from: "almizvitalij@gmail.com",
      subject: "Verify email",
      html: this.#createLetterTemplate(verificationToken),
    };

    this.#sender.send(msg);
  }
}

module.exports = MailgenService;

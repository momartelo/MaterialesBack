import { Router } from "express";
import mailgun from "mailgun-js";
import "dotenv/config";

const emailRouter = Router();

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

console.log(mg);
console.log("MAILGUN_API_KEY:", process.env.MAILGUN_API_KEY);
console.log("MAILGUN_DOMAIN:", process.env.MAILGUN_DOMAIN);

emailRouter.post("/send", (req, res) => {
  console.log("Request body:", req.body);
  const { nombre, email, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    console.error("Missing required fields:", { nombre, email, mensaje });
    return res.status(400).send("Missing required fields");
  }

  const data = {
    from: "noreplydtoestadistica@gmail.com", // Dirección del remitente
    to: "dtoestadisticaosse@gmail.com", // Dirección a la que se envía el correo
    subject: `Nuevo mensaje de ${nombre}`, // Asunto del correo
    text: `Nombre: ${nombre}\nCorreo: ${email}\nMensaje: ${mensaje}`, // Contenido del correo
  };

  mg.messages()
    .send(data)
    .then(() => res.status(200).send("Email sent"))
    .catch((error) => {
      console.error("Error sending email:", error);
      res.status(500).send(`Error: ${error.message}`);
    });
});

export { emailRouter };

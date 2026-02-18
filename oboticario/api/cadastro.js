import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Método não permitido");
  }

  const { nome, cpf, rg, nasc, email, genero, whats } = req.body;

  if (!nome || !cpf || !rg || !nasc || !email || !genero || !whats) {
    return res.status(400).send("Preencha todos os campos.");
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      subject: "Novo cadastro recebido",
      html: `
        <h2>Novo cadastro</h2>
        <p><b>Nome:</b> ${nome}</p>
        <p><b>CPF:</b> ${cpf}</p>
        <p><b>RG:</b> ${rg}</p>
        <p><b>Nascimento:</b> ${nasc}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Gênero:</b> ${genero}</p>
        <p><b>WhatsApp:</b> ${whats}</p>
      `
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    return res.status(500).send("Erro ao enviar e-mail");
  }
}

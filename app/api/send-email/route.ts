import nodemailer from "nodemailer";

import { withApiHandler } from "@/lib/api/errors";
import { successResponse } from "@/lib/api/response";
import { sendEmailSchema } from "@/lib/api/schemas";
import { parseJsonBody } from "@/lib/api/validation";

export const POST = withApiHandler(async (request) => {
  const { to, subject, html } = await parseJsonBody(request, sendEmailSchema);

  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: "admin@a-basa.com",
      pass: process.env.SMTP_PASSWORD!,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.sendMail({
    from: "admin@a-basa.com",
    to,
    subject,
    html,
  });

  return successResponse();
});

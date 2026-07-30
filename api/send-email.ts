import type { VercelRequest, VercelResponse } from "@vercel/node"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

// Inicializar Firebase Admin SDK usando la API modular moderna
if (!getApps().length) {
    try {
        initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            }),
        })
    } catch (e) {
        console.warn("Firebase Admin failed to initialize.", e)
    }
}

const ses = new SESClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
})

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_SUMMARY_LENGTH = 5000

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" })
    }

    // 1. Verificación de Autenticación de Firebase
    const authHeader = req.headers.authorization
    if (getApps().length && authHeader?.startsWith("Bearer ")) {
        const token = authHeader.split("Bearer ")[1]
        try {
            await getAuth().verifyIdToken(token)
        } catch {
            return res.status(401).json({ error: "Unauthorized: Invalid or expired token" })
        }
    } else if (process.env.REQUIRE_AUTH === "true") {
        return res.status(401).json({ error: "Unauthorized: Missing Authorization header" })
    }

    // 2. Validación del payload
    const { to, summary } = req.body ?? {}

    if (!to || !summary) {
        return res.status(400).json({ error: "Missing required fields: to, summary" })
    }

    if (typeof to !== "string" || !EMAIL_REGEX.test(to)) {
        return res.status(400).json({ error: "Invalid email format for 'to'" })
    }

    if (typeof summary !== "string" || summary.length > MAX_SUMMARY_LENGTH) {
        return res.status(400).json({
            error: `Summary exceeds maximum allowed length of ${MAX_SUMMARY_LENGTH} characters`,
        })
    }

    const from = process.env.SES_FROM_EMAIL

    if (!from) {
        return res.status(500).json({ error: "Server misconfigured: SES_FROM_EMAIL missing" })
    }

    try {
        const command = new SendEmailCommand({
            Source: from,
            Destination: { ToAddresses: [to] },
            Message: {
                Subject: { Data: "Tu resumen de TODOs" },
                Body: { Text: { Data: summary } },
            },
        })

        const result = await ses.send(command)

        return res.status(200).json({
            ok: true,
            messageId: result.MessageId,
        })
    } catch (err: unknown) {
        const name = err instanceof Error ? err.name : "UnknownError"
        const message = err instanceof Error ? err.message : "Failed to send email"
        console.error("SES send error:", name, message)
        return res.status(500).json({
            ok: false,
            error: name,
            message,
        })
    }
}
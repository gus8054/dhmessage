import express, { Request, Response } from "express";
import User from "../models/user.model.js";
import { verifyWebhook } from "@clerk/backend/webhooks";
// Clerk 웹훅 이벤트의 정확한 타입을 가져옵니다.
import { WebhookEvent } from "@clerk/backend";

const router = express.Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
    if (!signingSecret) {
      res.status(503).json({ message: "Webhook secret is not provided" });
      return;
    }

    // clerk's verifier expects a Web Request with the raw body; express.raw gives a Buffer.
    const payload = Buffer.isBuffer(req.body)
      ? req.body.toString("utf8")
      : String(req.body);

    // Express의 req.headers는 값으로 배열(string[])을 가질 수도 있는 타입이라
    // 기본 Headers 생성자와 호환되지 않아 타입 단언(as)을 사용해 줍니다.
    const request = new Request("http://internal/webhooks/clerk", {
      method: "POST",
      headers: new Headers(req.headers as Record<string, string>),
      body: payload,
    });

    // throws if the signature is wrong or the body was tampered with; only then do we trust evt.
    // verifyWebhook의 결과물을 WebhookEvent 타입으로 단언해 줍니다.
    const evt = (await verifyWebhook(request, {
      signingSecret,
    })) as WebhookEvent;

    if (evt.type === "user.created" || evt.type === "user.updated") {
      const u = evt.data;

      const email =
        u.email_addresses?.find((e) => e.id === u.primary_email_address_id)
          ?.email_address ?? u.email_addresses?.[0]?.email_address;

      const fullName =
        [u.first_name, u.last_name].filter(Boolean).join(" ") ||
        u.username ||
        email?.split("@")[0];

      await User.findOneAndUpdate(
        { clerkId: u.id },
        { clerkId: u.id, email, fullName, profilePic: u.image_url },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );
    }

    if (evt.type === "user.deleted") {
      if (evt.data.id) {
        await User.findOneAndDelete({ clerkId: evt.data.id });
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    const err = error as Error;
    console.error("Error in Clerk webhook:", err.message);
    res.status(400).json({ message: "Webhook verification failed" });
  }
});

export default router;

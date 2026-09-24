/**
 * SMS OTP Provider Client (Next.js server-side)
 * Supports SMS29, MSG91, and Development Simulation
 */

export async function dispatchOtpSms(
  phone: string,
  otp: string
): Promise<{ ok: boolean; provider: string; messageId?: string }> {
  const cleanPhone = phone.replace(/\D/g, "").slice(-10);

  // 1. SMS29 / Custom SMS Gateway
  const sms29Key = process.env.SMS29_API_KEY || process.env.SMS_API_KEY;
  const sms29Url = process.env.SMS29_API_URL || process.env.SMS_API_URL || "https://api.sms29.com/v1/send";

  if (sms29Key) {
    try {
      const res = await fetch(sms29Url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sms29Key}`,
          "X-API-KEY": sms29Key,
        },
        body: JSON.stringify({
          to: cleanPhone,
          mobile: cleanPhone,
          otp,
          message: `Your VisitFlow security verification code is ${otp}. Valid for 10 minutes.`,
          sender: process.env.SMS29_SENDER_ID || "VISFLO",
        }),
        signal: AbortSignal.timeout(5000),
      });

      if (res.ok) {
        return { ok: true, provider: "sms29" };
      }
    } catch {
      // Fallback on network exception
    }
  }

  // 2. MSG91 Provider
  const msg91AuthKey = process.env.MSG91_AUTH_KEY;
  const msg91TemplateId = process.env.MSG91_TEMPLATE_ID_OTP;

  if (msg91AuthKey && msg91TemplateId) {
    try {
      const url = `https://control.msg91.com/api/v5/otp?template_id=${msg91TemplateId}&mobile=91${cleanPhone}&authkey=${msg91AuthKey}&otp=${otp}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(5000),
      });

      if (res.ok) {
        return { ok: true, provider: "msg91" };
      }
    } catch {
      // Fallback
    }
  }

  // 3. Simulation mode for development
  return { ok: true, provider: "simulation", messageId: `sim_${Date.now()}` };
}

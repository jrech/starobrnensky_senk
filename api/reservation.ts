type Reservation = {
  name?: string;
  phone?: string;
  date?: string;
  time?: string;
  guests?: string | number;
  message?: string;
  website?: string;
};

const clean = (value: unknown, max = 240) => String(value ?? "").replace(/[<>]/g, "").trim().slice(0, max);

type ApiRequest = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type ApiResponse = {
  statusCode: number;
  setHeader(name: string, value: string): void;
  end(body?: string): void;
};

const environment = (globalThis as typeof globalThis & {
  process?: { env?: Record<string, string | undefined> };
}).process?.env ?? {};

const sendJson = (response: ApiResponse, status: number, body: object) => {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(body));
};

export default async function handler(request: ApiRequest, response: ApiResponse): Promise<void> {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    sendJson(response, 405, { message: "Povolená je pouze metoda POST." });
    return;
  }

  const contentLength = Number(request.headers["content-length"] || 0);
  if (contentLength > 12_000) {
    sendJson(response, 413, { message: "Požadavek je příliš velký." });
    return;
  }

  let body: Reservation;
  try {
    const parsed = typeof request.body === "string" ? JSON.parse(request.body) : request.body;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid reservation body");
    body = parsed as Reservation;
  } catch {
    sendJson(response, 400, { message: "Neplatná data formuláře." });
    return;
  }

  if (body.website) {
    sendJson(response, 200, { ok: true });
    return;
  }

  const name = clean(body.name, 80);
  const phone = clean(body.phone, 40);
  const date = clean(body.date, 10);
  const time = clean(body.time, 5);
  const guests = Number(body.guests);
  const message = clean(body.message, 800);

  if (!name || !phone || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time) || !Number.isInteger(guests) || guests < 1 || guests > 30) {
    sendJson(response, 400, { message: "Zkontrolujte prosím vyplněné údaje." });
    return;
  }

  const apiKey = environment.RESEND_API_KEY;
  const to = environment.RESERVATION_TO_EMAIL;
  if (!apiKey || !to) {
    sendJson(response, 503, { message: "Online rezervace se právě nastavuje. Zavolejte nám prosím na +420 776 791 144." });
    return;
  }

  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: environment.RESERVATION_FROM_EMAIL || "Šenk rezervace <rezervace@starobrnenskysenk.cz>",
      to: [to],
      subject: `Rezervace: ${name} · ${date} ${time} · ${guests} osob`,
      text: [`Jméno: ${name}`, `Telefon: ${phone}`, `Datum: ${date}`, `Čas: ${time}`, `Počet osob: ${guests}`, `Poznámka: ${message || "—"}`].join("\n"),
    }),
  });

  if (!emailResponse.ok) {
    console.error("Reservation email failed", emailResponse.status, await emailResponse.text());
    sendJson(response, 502, { message: "Žádost se nepodařilo odeslat. Zavolejte nám prosím." });
    return;
  }

  sendJson(response, 200, { ok: true });
}

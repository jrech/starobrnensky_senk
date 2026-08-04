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

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return Response.json({ message: "Povolená je pouze metoda POST." }, { status: 405, headers: { Allow: "POST" } });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 12_000) return Response.json({ message: "Požadavek je příliš velký." }, { status: 413 });

  let body: Reservation;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Neplatná data formuláře." }, { status: 400 });
  }

  if (body.website) return Response.json({ ok: true });

  const name = clean(body.name, 80);
  const phone = clean(body.phone, 40);
  const date = clean(body.date, 10);
  const time = clean(body.time, 5);
  const guests = Number(body.guests);
  const message = clean(body.message, 800);

  if (!name || !phone || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time) || !Number.isInteger(guests) || guests < 1 || guests > 30) {
    return Response.json({ message: "Zkontrolujte prosím vyplněné údaje." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.RESERVATION_TO_EMAIL;
  if (!apiKey || !to) {
    return Response.json({ message: "Online rezervace se právě nastavuje. Zavolejte nám prosím na +420 776 791 144." }, { status: 503 });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.RESERVATION_FROM_EMAIL || "Šenk rezervace <rezervace@starobrnenskysenk.cz>",
      to: [to],
      subject: `Rezervace: ${name} · ${date} ${time} · ${guests} osob`,
      text: [`Jméno: ${name}`, `Telefon: ${phone}`, `Datum: ${date}`, `Čas: ${time}`, `Počet osob: ${guests}`, `Poznámka: ${message || "—"}`].join("\n"),
    }),
  });

  if (!response.ok) {
    console.error("Reservation email failed", response.status, await response.text());
    return Response.json({ message: "Žádost se nepodařilo odeslat. Zavolejte nám prosím." }, { status: 502 });
  }

  return Response.json({ ok: true });
}

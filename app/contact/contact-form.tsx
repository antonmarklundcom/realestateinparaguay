"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      message: form.get("message"),
      page: "/contact",
      locale: "en",
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("sent");
      e.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="text-center text-zinc-700">
        Thanks — we&apos;ll be in touch shortly.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        name="name"
        required
        placeholder="Name"
        className="border border-black/20 rounded-lg px-4 py-3"
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        className="border border-black/20 rounded-lg px-4 py-3"
      />
      <input
        name="phone"
        placeholder="Phone / WhatsApp"
        className="border border-black/20 rounded-lg px-4 py-3"
      />
      <textarea
        name="message"
        required
        rows={4}
        placeholder="What are you looking for?"
        className="border border-black/20 rounded-lg px-4 py-3"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-black text-white px-6 py-3 text-sm font-medium disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Send"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-600">
          Something went wrong — please try WhatsApp instead.
        </p>
      )}
    </form>
  );
}

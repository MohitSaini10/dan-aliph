import Subscriber from "@/models/Subscriber";
import { sendEmail } from "@/lib/mailer";
import { newBookPublishedTemplate } from "@/lib/emailTemplates";

export async function sendNewBookPublishedEmail(book: any) {
  const subscribers = await Subscriber.find({ isActive: true });

  for (const sub of subscribers) {
    await sendEmail({
      to: sub.email,
      subject: `📘 New Book Published: ${book.title}`,
      html: newBookPublishedTemplate(book, sub.unsubscribeToken),
    });
  }

  return subscribers.length;
}

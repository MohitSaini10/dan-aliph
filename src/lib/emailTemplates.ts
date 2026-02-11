export function newsletterTemplate(
  title: string,
  content: string,
  unsubscribeToken: string
) {
  const unsubscribeUrl =
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/unsubscribe?token=${unsubscribeToken}`;

  return `
    <div style="font-family: Arial, sans-serif; line-height:1.6">
      <h2>${title}</h2>
      <p>${content}</p>

      <hr />
      <p style="font-size:12px;color:#666">
        You are receiving this email because you subscribed to our updates.
        <br />
        <a href="${unsubscribeUrl}">Unsubscribe</a>
      </p>
    </div>
  `;
}

export function newBookPublishedTemplate(
  book: {
    title: string;
    authorName?: string;
    description?: string;
    slug?: string;
  },
  unsubscribeToken: string
) {
  const bookUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/books/${book.slug}`;
  const unsubscribeUrl =
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/unsubscribe?token=${unsubscribeToken}`;

  return `
    <div style="font-family: Arial, sans-serif; line-height:1.6">
      <h2>📚 New Book Published!</h2>

      <h3>${book.title}</h3>
      ${book.authorName ? `<p><strong>Author:</strong> ${book.authorName}</p>` : ""}
      ${book.description ? `<p>${book.description}</p>` : ""}

      <p>
        <a href="${bookUrl}" target="_blank">
          👉 Read / View Book
        </a>
      </p>

      <hr />
      <p style="font-size:12px;color:#666">
        You received this email because you subscribed to our updates.
        <br />
        <a href="${unsubscribeUrl}">Unsubscribe</a>
      </p>
    </div>
  `;
}

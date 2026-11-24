import type { StatementConfig } from "./config.ts";

export const TOOLBAR_DISCLAIMER =
  "תפריט הנגישות לבדו אינו הופך אתר לנגיש ואינו מעיד על עמידה בתקן או בתקנות.";

export const NON_CLAIM =
  'ההצהרה אינה קובעת עמידה בת"י 5568 או בתקנות שוויון זכויות לאנשים עם מוגבלות.';

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function listBlock(items: string[], emptyText: string, format: "html" | "md"): string {
  if (items.length === 0) return format === "html" ? `<p>${escapeHtml(emptyText)}</p>` : emptyText;
  if (format === "md") return items.map((item) => `- ${item}`).join("\n");
  return `<ul>\n${items.map((item) => `  <li>${escapeHtml(item)}</li>`).join("\n")}\n</ul>`;
}

function contactValue(value: string, href: string | null): string {
  const safe = escapeHtml(value);
  if (!href) return `<dd>${safe}</dd>`;
  return `<dd><a href="${escapeHtml(href)}">${safe}</a></dd>`;
}

function mailto(email: string): string | null {
  if (email.includes("{") || email.includes("}") || /\s/.test(email) || !email.includes("@")) return null;
  return `mailto:${email}`;
}

function tel(phone: string): string | null {
  if (!/^[0-9+().\-\s]+$/.test(phone)) return null;
  return `tel:${phone.replaceAll(/\s+/g, "")}`;
}

export function assertStylesheet(href: string): void {
  if (!/^[A-Za-z0-9._/-]+$/.test(href) || href.includes("..")) {
    throw new Error("stylesheet must be a relative path.");
  }
}

export function renderStatement(
  config: StatementConfig,
  format: "html" | "md" = "html",
  stylesheet?: string,
): string {
  if (stylesheet) assertStylesheet(stylesheet);
  const appointed = config.coordinator.appointed
    ? "הפרטים שלהלן נמסרו כפרטי רכז הנגישות."
    : "לא נמסר שמונה רכז נגישות לפי סעיף 19מב לחוק שוויון זכויות לאנשים עם מוגבלות. הפרטים שלהלן הם פרטי פנייה בלבד.";
  const frame = `הצהרה זו מפורסמת עבור ${config.controller} לפי תקנה 35ה לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג-2013, ובהתייחס לת"י 5568. ההצהרה מתארת רק פרטים שנמסרו בקובץ התצורה. ${NON_CLAIM}`;
  const testsLead =
    "הרשימה שלהלן היא הרשימה המלאה של הבדיקות שנמסרו. בדיקה שאינה מופיעה בה אינה נטענת בהצהרה זו.";
  const adjustments = listBlock(config.adjustments, "לא נמסר תיאור של התאמות שבוצעו.", format);
  const tests = listBlock(config.tests, "לא נמסרו בדיקות שבוצעו.", format);
  const limitations = listBlock(
    config.limitations,
    "לא נמסרו מגבלות ידועות בקובץ התצורה. אין בכך קביעה שאין מגבלות.",
    format,
  );
  const placeholderNote = [config.controller, config.coordinator.name, config.coordinator.phone, config.coordinator.email].some(
    (value) => value.includes("{{"),
  )
    ? "יש להחליף כל ערך שבסוגריים מסולסלים בפרט אמיתי לפני פרסום. ערך שלא הוחלף אינו פרט קשר."
    : "";

  if (format === "md") {
    const lines = [
      "# הצהרת נגישות",
      "",
      TOOLBAR_DISCLAIMER,
      "",
      frame,
      "",
      "## התאמות שנמסרו",
      "",
      adjustments,
      "",
      "## בדיקות שנמסרו",
      "",
      testsLead,
      "",
      tests,
      "",
      "## מגבלות ידועות",
      "",
      limitations,
      "",
      "## פנייה בנושא נגישות",
      "",
      "לצורך הודעה על היעדר התאמה או בקשה לביצוע הנגשה, לרבות פנייה לפי תקנה 35א(ד):",
      "",
      appointed,
      "",
      `- שם: ${config.coordinator.name}`,
      `- טלפון: ${config.coordinator.phone}`,
      `- דוא"ל: ${config.coordinator.email}`,
      "",
      `תאריך ההצהרה: ${config.date}`,
    ];
    if (placeholderNote) lines.push("", placeholderNote);
    return `${lines.join("\n")}\n`;
  }

  const style = stylesheet ? `\n  <link rel="stylesheet" href="${escapeHtml(stylesheet)}">` : "";
  const note = placeholderNote ? `\n    <p>${escapeHtml(placeholderNote)}</p>` : "";
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>הצהרת נגישות</title>${style}
</head>
<body>
  <a class="skip" href="#content">דילוג לתוכן</a>
  <main id="content">
    <h1>הצהרת נגישות</h1>
    <p class="notice">${escapeHtml(TOOLBAR_DISCLAIMER)}</p>
    <p>${escapeHtml(frame)}</p>
    <h2>התאמות שנמסרו</h2>
    ${adjustments}
    <h2>בדיקות שנמסרו</h2>
    <p>${escapeHtml(testsLead)}</p>
    ${tests}
    <h2>מגבלות ידועות</h2>
    ${limitations}
    <h2>פנייה בנושא נגישות</h2>
    <p>לצורך הודעה על היעדר התאמה או בקשה לביצוע הנגשה, לרבות פנייה לפי תקנה 35א(ד).</p>
    <p>${escapeHtml(appointed)}</p>
    <dl>
      <dt>שם</dt>
      ${contactValue(config.coordinator.name, null)}
      <dt>טלפון</dt>
      ${contactValue(config.coordinator.phone, tel(config.coordinator.phone))}
      <dt>דוא"ל</dt>
      ${contactValue(config.coordinator.email, mailto(config.coordinator.email))}
    </dl>
    <h2>תאריך</h2>
    <p>תאריך ההצהרה: <time datetime="${escapeHtml(config.date)}">${escapeHtml(config.date)}</time></p>${note}
  </main>
</body>
</html>
`;
}

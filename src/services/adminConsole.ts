const BASE_URL = window.location.origin + window.location.pathname;

function encodePhone(phone: string): string {
  try {
    return btoa(phone);
  } catch {
    return '';
  }
}

function generateLink(phone: string, path: string): string {
  const encoded = encodePhone(phone);
  return `${BASE_URL}#/${path}${encoded ? `?r=${encoded}` : ''}`;
}

function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text).catch(() => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  });
}

function openWhatsApp(phone: string, message: string): void {
  const cleaned = phone.replace(/[^0-9]/g, '');
  const url = `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMMANDS: Record<string, (...args: any[]) => any> = {
  service(phone: string) {
    const link = generateLink(phone, 'survey-service');
    const msg = `Hola, tu opinion nos importa. Califica tu experiencia en soul:23:\n${link}`;
    copyToClipboard(msg);
    openWhatsApp(phone, msg);
    return { link, message: msg };
  },
  contact(phone: string) {
    const link = generateLink(phone, 'contact-survey');
    const msg = `Hola, completame esta breve encuesta para conocerte mejor:\n${link}`;
    copyToClipboard(msg);
    openWhatsApp(phone, msg);
    return { link, message: msg };
  },
  rsvp(phone: string) {
    const link = generateLink(phone, 'rsvp');
    const msg = `Confirmar asistencia a evento soul:23:\n${link}`;
    copyToClipboard(msg);
    openWhatsApp(phone, msg);
    return { link, message: msg };
  },
  evaluate(phone: string) {
    const link = generateLink(phone, 'evaluate');
    const msg = `Evaluacion de personal soul:23:\n${link}`;
    copyToClipboard(msg);
    openWhatsApp(phone, msg);
    return { link, message: msg };
  },
  feedback(phone: string) {
    const link = generateLink(phone, 'project-feedback');
    const msg = `Encuesta de satisfaccion soul:23:\n${link}`;
    copyToClipboard(msg);
    openWhatsApp(phone, msg);
    return { link, message: msg };
  },
  link(phone: string, type: string) {
    const path = type === 'service' ? 'survey-service' : type === 'contact' ? 'contact-survey' : type === 'rsvp' ? 'rsvp' : type === 'evaluate' ? 'evaluate' : 'project-feedback';
    return generateLink(phone, path);
  },
  batch(numbers: string[], type: string) {
    return numbers.map((n) => ({ phone: n, ...(COMMANDS[type](n) as { link: string; message: string }) }));
  },
  help() {
    const helpText = `
soul:23 Admin Console
=====================
COMMANDS:
  Soul23Admin.service(phone)   - Encuesta post-servicio
  Soul23Admin.contact(phone)   - Lead intake
  Soul23Admin.rsvp(phone)      - RSVP evento
  Soul23Admin.evaluate(phone)  - Evaluacion personal
  Soul23Admin.feedback(phone)  - NPS post-proyecto
  Soul23Admin.link(phone, type) - Solo genera link
  Soul23Admin.batch(numbers, type) - Links masivos
  Soul23Admin.help()           - Esta ayuda
    `.trim();
    console.log(helpText);
    return helpText;
  },
};

if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).Soul23Admin = COMMANDS;
  console.log('[soul:23 Admin] Type Soul23Admin.help() for commands');
}

export default COMMANDS;

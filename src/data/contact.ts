export const contact = {
  city: "Addis Ababa, Ethiopia",
  namedContact: "Sara Abebe",
  emails: {
    general: "info@daisyhotelsupplies.com",
    sara: "sara.abebe@daisyhotelsupplies.com",
  },
  phones: [
    {
      id: "main",
      local: "0911 340 146",
      international: "+251 911 340 146",
      stored: "251911340146",
      tel: "tel:0911340146",
      role: "Calls and WhatsApp",
      primary: true,
    },
    {
      id: "alt-1",
      local: "0906 344 443",
      international: "+251 906 344 443",
      stored: "251906344443",
      tel: "tel:0906344443",
      role: "Additional line",
      primary: false,
    },
    {
      id: "alt-2",
      local: "0906 337 722",
      international: "+251 906 337 722",
      stored: "251906337722",
      tel: "tel:0906337722",
      role: "Additional line",
      primary: false,
    },
  ],
  whatsapp: {
    url: "https://wa.me/251911340146",
    message: "Hello Daisy Hotel Supplies, I would like to inquire.",
  },
  social: {
    tiktok: "https://www.tiktok.com/@sara.grand.hote",
  },
  hours: {
    weekdays: "Monday–Saturday · 9:00 am – 8:00 pm",
    sunday: "Sunday · 11:00 am – 7:00 pm",
  },
  boutiques: [
    {
      id: "01",
      address: "Gollgul Tower, 1st floor, shop 106",
      mapsQuery: "Gollgul Tower, Addis Ababa",
    },
    {
      id: "02",
      address: "Century Mall, 3rd floor, shop 338",
      mapsQuery: "Century Mall, Addis Ababa",
    },
    {
      id: "03",
      address: "Bole Medhanialem, Fana Plaza, ground floor",
      mapsQuery: "Fana Plaza, Bole Medhanialem, Addis Ababa",
    },
    {
      id: "04",
      address: "Lebu, Panda Mall, ground floor",
      mapsQuery: "Panda Mall, Lebu, Addis Ababa",
    },
  ],
} as const;

export function mapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function whatsappUrl(message = contact.whatsapp.message) {
  return `${contact.whatsapp.url}?text=${encodeURIComponent(message)}`;
}

export const primaryPhone = contact.phones.find((phone) => phone.primary)!;

import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
  const hostname = context.url.hostname.toLowerCase();
  if (["aljannahcenter.com", "www.aljannahcenter.com", "www.aljannahcentre.com"].includes(hostname)) {
    const destination = new URL(context.url);
    destination.protocol = "https:";
    destination.host = "aljannahcentre.com";
    destination.port = "";
    return context.redirect(destination.toString(), 308);
  }
  return next();
});

import * as Sentry from "@sentry/react-router";

Sentry.init({
  dsn: "https://398ef09bd89daffda48ff31d0aec85d3@o4509218266546176.ingest.us.sentry.io/4509218276769792",
  
  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});

import bunyan from "bunyan";

export const log = bunyan.createLogger({
  name: "SA",
  src: true,
  level: process.env.NODE_ENV === "dev" ? bunyan.INFO : bunyan.ERROR,
});

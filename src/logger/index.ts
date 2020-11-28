import bunyan from "bunyan";

export const log = bunyan.createLogger({
  name: "SA",
  src: process.env.NODE_ENV === "dev" ? true : false,
});

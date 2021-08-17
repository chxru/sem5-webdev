import chalk from "chalk";

type loglevel = "info" | "success" | "error" | "debug";

export const logger = async (
  log: string,
  level: loglevel = "debug"
): Promise<void> => {
  const d = new Date();
  const t = d.toTimeString().split(" ")[0];
  switch (level) {
    case "error":
      console.log(t, chalk.black.bgRed("ERROR:"), log);
      break;

    case "info":
      console.log(t, chalk.black.bgYellow("INFO:"), log);
      break;

    case "success":
      console.log(t, chalk.black.bgGreen("SUCCESS:"), log);
      break;

    case "debug":
      if (!process.env.PRODUCTION)
        console.log(t, chalk.black.bgWhite("DEBUG:"), log);
      break;
  }
};

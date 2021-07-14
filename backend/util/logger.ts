import chalk from "chalk";

type loglevel = "info" | "success" | "error" | "debug";

export const logger = async (
  log: string,
  level: loglevel = "debug"
): Promise<void> => {
  switch (level) {
    case "error":
      console.log(chalk.black.bgRed("ERROR:"), log);
      break;

    case "info":
      console.log(chalk.black.bgYellow("INFO:"), log);
      break;

    case "success":
      console.log(chalk.black.bgGreen("SUCCESS:"), log);
      break;

    case "debug":
      if (!process.env.PRODUCTION)
        console.log(chalk.black.bgWhite("DEBUG:"), log);
      break;
  }
};

const { join } = require("path");
const { exec } = require("shelljs");

/*
  Execute schema/table creation before server starts.
  Executing before nodemon as a separate process because
  this code doesn't meant to run repeatedly on each 
  nodemon restart.
*/
(() => {
exec(
      `bash ${join(__dirname, "importsql.sh")} sem5db`,
      { async: true, silent: true },
      (code, stdout, stderr) => {
        if (stderr) {
          console.log(stderr);
        }

        if (code === 0) {
          console.log("SQL files executed");
        } else {
          console.log("SQL bash script exited with 1", "error");
          console.log(stdout);
        }
      }
    );
})();
const args = process.argv.slice(2);

const request = require("request");
const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

request(args[0], (error, response, body) => {
  if (!response) {
    console.log("Address does not exist");
    process.exit();
  } else if (response.statusCode === 200) {
    if (fs.existsSync(args[1])) {
      rl.question(
        "File exists already, would you like to overwrite? (y)es or (n)o?   ",
        (answer) => {
          if (answer === "y") {
            fs.writeFile(args[1], body, (err) => {
              if (err) throw err;
              console.log(
                `The file has been overwritten, and downloaded ${
                  fs.statSync("./index.html").size
                } bytes to ${args[1]}.`
              );

              rl.close();
            });
          }

          if (answer === "n") {
            console.log("File has not been overwritten");

            rl.close();
          }
        }
      );
    } else {
      fs.writeFile(args[1], body, (err) => {
        if (err) throw err;
        console.log(
          `The file has been saved and downloaded ${
            fs.statSync("./index.html").size
          } bytes to ${args[1]}.`
        );
        process.exit();
      });
    }
  } else {
    console.log(error);
    process.exit();
  }
});

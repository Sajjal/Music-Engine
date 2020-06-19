const fs = require("fs");

module.exports = {
  suggestRandomString: async function () {
    const line = new Promise((resolve, reject) => {
      fs.readFile("./public/randomList.txt", function (err, data) {
        if (err) throw err;
        let lines = data.toString().split("\n");
        let randomLine = lines[Math.floor(Math.random() * lines.length)];
        resolve(randomLine);
      });
    });
    await line;
    return line;
  },
};

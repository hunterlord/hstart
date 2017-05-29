const readline = require('readline');
const fs = require('fs');

class CQuestion {
  constructor() {
    this.data = {};
  }

  makeQuestion(key, question) {
    let rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve, reject) => {
      rl.question(question, answer => {
        this.data[key] = answer;
        resolve(true);
        rl.close();
      });
    });
  }

  async run(list = {}) {
    for (let key in list) {
      await this.makeQuestion(key, list[key]);
    }

    return this.data;
  }
}

module.exports = CQuestion;

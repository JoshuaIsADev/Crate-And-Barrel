const fs = require('fs');

class UsersRepository {
  constructor(filename) {
    if (!filename) {
      throw new Error('Creating a repository requires a filename');
    }

    this.filename = filename;
    try {
      fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(this.filename, '[]');
    }
  }

  async getAll() {
    //Open the file called this.filename
    const contents = await fs.promises.readFile(this.filename, {
      encoding: 'utf8',
    });

    //Read contents
    console.log(contents);

    //parse the contents

    //return the parsed data
  }
}

//TESTING CODE HELPER FUNCTION
const test = async () => {
  const repo = new UsersRepository('users.json');

  await repo.getAll();
};

test();

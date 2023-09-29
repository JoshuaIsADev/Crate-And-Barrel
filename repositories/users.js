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
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: 'utf8',
      })
    );

    //Read contents
    // console.log(contents);

    //parse the contents
    // const data = JSON.parse(contents);

    //return the parsed data
    // return data;
  }

  async create(attrs) {
    //{email:'r9r9ru23@yahoo.com', passwords: 'j3rrrr'}
    const records = await this.getAll();
    records.push(attrs);
    //write the updated records array back to this.filename
    await fs.promises.writeFile(this.filename, JSON.stringify(records));
  }
}

//TESTING CODE HELPER FUNCTION
const test = async () => {
  const repo = new UsersRepository('users.json');
  await repo.create({ email: ' test@test.com', password: 'password' });
  const users = await repo.getAll();
  console.log(users);
};

test();

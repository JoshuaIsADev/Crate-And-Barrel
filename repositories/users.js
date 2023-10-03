const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const scrypt = util.promisify(crypto.scrypt);

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
    //attrs === { email: '', password: ''}
    attrs.id = this.randomId();

    const salt = crypto.randomBytes(8).toString('hex');
    // scrypt(attrs.password, salt, 64, (err, buf) => {
    //   const hashed = buff.toString('hex');
    // });
    const buf = await scrypt(attrs.password, salt, 64);

    //{email:'r9r9ru23@yahoo.com', passwords: 'j3rrrr'}
    const records = await this.getAll();
    const record = {
      ...attrs,
      password: `${buf.toString('hex')}.${salt}`,
    };
    records.push(record);
    await this.writeAll(records);

    return record;
  }

  async writeAll(records) {
    //write the updated records array back to this.filename
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }

  randomId() {
    return crypto.randomBytes(4).toString('hex');
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecords);
  }

  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);

    if (!record) {
      throw new Error(`Record with id ${id} not found`);
    }

    Object.assign(record, attrs);
    await this.writeAll(records);
  }

  async getOneBy(filters) {
    const records = await this.getAll();

    for (let record of records) {
      let found = true;

      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }
      if (found) {
        return record;
      }
    }
  }
}

module.exports = new UsersRepository('users.json');

//TESTING CODE HELPER FUNCTION
// const test = async () => {
//   const repo = new UsersRepository('users.json');
//   const user = await repo.getOneBy({
//     email: 'test@test.com',
//     password: 'mypw',
//     id: '614f4b08',
//   });

//   console.log(user);
// };

// test();

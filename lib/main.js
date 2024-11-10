const fs = require("fs").promises;
const path = require("path");

class Database {
   constructor({ database = "./database.json", model }) {
      this.dbFilePath = database;
      this.model = model;

      (async () => {
         try {
            // Cek apakah file sudah ada, jika tidak buat baru
            await fs.access(this.dbFilePath);
         } catch {
            await fs.writeFile(this.dbFilePath, JSON.stringify({}), "utf-8");
         }

         if (this.model) {
            this.model = require(path.resolve(this.model));
         }
      })();
   }

   async _loadData() {
      try {
         const data = await fs.readFile(this.dbFilePath, "utf-8");
         return JSON.parse(data);
      } catch (error) {
         console.error(`Load Data Error: ${error.message}`);
         return {};
      }
   }

   async _saveData(data) {
      try {
         await fs.writeFile(this.dbFilePath, JSON.stringify(data, null, 2), "utf-8");
      } catch (error) {
         console.error(`Save Data Error: ${error.message}`);
      }
   }

   async getCollection(collectionName) {
      const data = await this._loadData();
      return data[collectionName] || [];
   }

   async saveCollection(collectionName, items) {
      const data = await this._loadData();
      data[collectionName] = items;
      await this._saveData(data);
   }
}

class Model {
   constructor(db, collectionName, schema = {}) {
      this.db = db;
      this.collectionName = collectionName;
      this.schema = schema;
   }

   _validateDocument(doc) {
      const validatedDoc = {};
      for (const field in doc) {
         if (this.schema[field] && typeof doc[field] !== this.schema[field]) {
            throw new Error(`Invalid Type: Field "${field}" should be of type "${this.schema[field]}" but received "${typeof doc[field]}"`);
         }
         validatedDoc[field] = doc[field];
      }
      return validatedDoc;
   }

   async addEntry(doc) {
      try {
         const validatedDoc = this._validateDocument(doc);
         const items = await this.db.getCollection(this.collectionName);
         items.push(validatedDoc);
         await this.db.saveCollection(this.collectionName, items);
         return validatedDoc;
      } catch (error) {
         console.error(`Add Entry Error: ${error.message}`);
      }
   }

   async getAll() {
      try {
         return await this.db.getCollection(this.collectionName);
      } catch (error) {
         console.error(`Get All Error: Unable to retrieve data. ${error.message}`);
      }
   }

   async getOne(filter) {
      try {
         const items = await this.db.getCollection(this.collectionName);
         const result = items.find(item => Object.keys(filter).every(key => item[key] === filter[key]));
         if (!result) throw new Error(`Data Not Found: No entry matches the filter ${JSON.stringify(filter)}`);
         return result;
      } catch (error) {
         console.error(`Get One Error: ${error.message}`);
      }
   }

   async updateEntry(filter, updatedData) {
      try {
         const items = await this.db.getCollection(this.collectionName);
         const item = items.find(item => Object.keys(filter).every(key => item[key] === filter[key]));
         if (!item) throw new Error(`Data Not Found: No entry matches the filter ${JSON.stringify(filter)}`);

         const validatedUpdate = this._validateDocument(updatedData);
         Object.assign(item, validatedUpdate);

         await this.db.saveCollection(this.collectionName, items);
         return item;
      } catch (error) {
         console.error(`Update Entry Error: ${error.message}`);
      }
   }
   async removeEntry(filter) {
      try {
         let items = await this.db.getCollection(this.collectionName);
         const originalLength = items.length;
         items = items.filter(item => !Object.keys(filter).every(key => item[key] === filter[key]));
         if (items.length === originalLength) throw new Error(`Data Not Found: No entry matches the filter ${JSON.stringify(filter)}`);
         await this.db.saveCollection(this.collectionName, items);
      } catch (error) {
         console.error(`Remove Entry Error: ${error.message}`);
      }
   }

   async appendToArray(fieldName, value) {
      try {
         const data = await this.db.getCollection(this.collectionName);
         data.forEach(item => {
            if (Array.isArray(item[fieldName])) {
               item[fieldName].push(value);
            } else {
               item[fieldName] = [value];
            }
         });
         await this.db.saveCollection(this.collectionName, data);
      } catch (error) {
         console.error(`Append To Array Error: ${error.message}`);
      }
   }

   async removeField(fieldName) {
      try {
         const data = await this.db.getCollection(this.collectionName);
         data.forEach(item => {
            if (fieldName in item) delete item[fieldName];
         });
         await this.db.saveCollection(this.collectionName, data);
      } catch (error) {
         console.error(`Remove Field Error: ${error.message}`);
      }
   }
}

module.exports = { Database, Model }
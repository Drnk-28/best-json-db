# best-json-db
The best JSON database solution for lightweight projects, ideal for caching and local storage needs.

## Introduction
The code provided is a lightweight database management system built with Node.js, using the file system (fs) to store data in a JSON file (database.json). This system is designed to handle basic data operations—such as adding, retrieving, updating, and deleting entries—using collections as in a NoSQL database.

### This system consists of two main classes:
#### Database:
Manages the JSON file where data is stored. It ensures the file exists, loads data from the file, and saves updates back to it.

#### Model:
Represents a specific collection (like a table in SQL or a collection in MongoDB). Each model can have its own schema, enforcing data types on fields. This class handles operations on its collection, including:

- **Adding entries** with validation to ensure data follows the schema.

- **Retrieving entries**, either all entries or single entries based on a filter.

- **Updating entries** by matching fields to a filter and modifying values.

- **Deleting entries** based on a filter.

- **Appending values** to an array within a document.

- **Removing fields** from all documents in a collection.

### Example Usage

Each example demonstrates a different feature, from adding data to removing fields, providing a simple way to manipulate JSON-stored data without needing a full database engine. This is ideal for small applications or projects where lightweight, file-based data storage is sufficient.

The following is the use of each method.
#### Preparing database and models

First of all, create a file with the example `"database.json"`
```json
{}
```
Well, that's enough, after that we move to the main file with the example `"index.js"`
```js
const { Database, Model } = require("best-json-db");

// Initialize Database and define schema
const db = new Database({ database: "./database.json" });

const userSchema = {
   name: "string",
   age: "number",
   email: "string",
}

// Initialize Model for the "users" collection
const userModel = new Model(db, "users", userSchema);
```
or maybe you want to import a schema from a different file 
```js
const userSchema = {
   name: "string",
   age: "number",
   email: "string",
}
module.exports = userSchema
```
After that, we can do it like this.
```js
const schema = require("./path/to/file.js")

// Initialize Model for the "users" collection
const userModel = new Model(db, "users", schema);
```
#### Example 1: Adding a New Data
```js
(async () => {
   // Add a new user entry to the "users" collection
   await userModel.addEntry({ name: "John", age: 25, email: "john@example.com" });
   console.log("New user added successfully.");
   // Output: Adds new user data to "users" collection with the specified values.
})();
```

#### Example 2: Retrieving All Data
```js
// Retrieve all data from the "users" collection
(async () => {
   const users = await userModel.getAll();
   console.log("All Users:", users);
   // Output: Displays all entries in the "users" collection.
})();
```
#### Example 3: Retrieving a Single Data Entry with Filter
```js
// Retrieve a single user based on a filter
(async () => {
   const user = await userModel.getOne({ name: "John" });
   console.log("User Found:", user);
   // Output: Displays the user data with the name "John".
})();
```
#### Example 4: Updating an Entry with a Filter
```js
// Update an existing user entry based on a filter
(async () => {
   const updatedUser = await userModel.updateEntry({ name: "John" }, { age: 26 });
   console.log("Updated User:", updatedUser);
   // Output: Updates user "John" with a new age value of 26 and displays the updated data.
})();
```
#### Example 5: Appending a Value to an Array Field
```js
// Append a value to an array field in the users collection
(async () => {
   await userModel.appendToArray("hobbies", "reading");
   console.log("All Users after appending hobby:", await userModel.getAll());
   // Output: Adds "reading" to the "hobbies" field for each user. If "hobbies" does not exist, it creates an array with "reading".
})();
```
#### Example 6: Removing a Specific Field from All Entries
```js
// Remove the "email" field from all users in the collection
(async () => {
   await userModel.removeField("email");
   console.log("All Users after removing email field:", await userModel.getAll());
   // Output: Removes the "email" field from every entry in the "users" collection.
})();
```

#### Example 7: Removing an Entry Based on Filter
```js
// Remove a user entry based on a filter
(async () => {
   await userModel.removeEntry({ name: "John" });
   console.log("All Users after removing John:", await userModel.getAll());
   // Output: Deletes the user with the name "John" from the users collection.
})();
```

### Explanation of Each Example Output

- Example 1:
  * Adds a new user `{"name": "John", "age": 25, "email": "john@example.com"}` to `./database.json`.


- Example 2:
  * Displays all users in the collection, including those added in previous examples.


- Example 3: 
  * Retrieves and displays the user with name: `"John"`.


- Example 4:
  * Updates the user `"John"` to have an age of `26` and displays the updated data.


- Example 5: 
  * Appends `"reading"` to each user's hobbies field. If hobbies does not exist, creates it as an array containing `"reading"`.


- Example 6: 
  * Removes the email field from each user in the collection and displays the result.


- Example 7: 
  * Deletes the user named John from the collection and displays the remaining entries.


These separate examples will sequentially demonstrate each feature and update `database.json` accordingly.

In conclusion, this simple file-based database system provides an efficient and lightweight solution for managing and manipulating data stored in JSON format. With the combination of the Database and Model classes, it allows for easy handling of common database operations like adding, retrieving, updating, and deleting records. This approach is perfect for small-scale applications, projects, or learning purposes where you need a fast, easy-to-implement database solution without the overhead of a full-fledged database engine. By using just Node.js and the built-in fs module, it offers a straightforward way to work with data persistently in a non-relational style.


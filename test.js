// Import Database and Model from the previously created file
const { Database, Model } = require("./index");

// Initialize Database
const db = new Database({ database: "./database.json" });

// Define schema for our model
const userSchema = {
   name: "string",
   age: "number",
   email: "string",
};

// Initialize Model for the "users" collection
const userModel = new Model(db, "users", userSchema);

(async () => {
   // Example 1: Add new data to the "users" collection
   await userModel.addEntry({ name: "John", age: 25, email: "john@example.com" });
   // Output: Adds data to the users collection with valid values.

   // Example 2: Retrieve all data from the "users" collection
   const users = await userModel.getAll();
   console.log("All Users:", users);
   // Output: Displays all data in the "users" collection

   // Example 3: Retrieve a single data entry based on filter
   const user = await userModel.getOne({ name: "John" });
   console.log("User Found:", user);
   // Output: Displays user data with the name "John"

   // Example 4: Update user data based on filter
   const updatedUser = await userModel.updateEntry({ name: "John" }, { age: 26 });
   console.log("Updated User:", updatedUser);
   // Output: Displays updated data for user "John" with age updated to 26

   // Example 5: Append a value to an array in a specified field
   await userModel.appendToArray("hobbies", "reading");
   console.log("All Users after appending hobby:", await userModel.getAll());
   // Output: Adds "reading" to the "hobbies" field for each user. If "hobbies" does not exist, it will create an array with "reading".

   // Example 6: Remove a specific field from all users
   await userModel.removeField("email");
   console.log("All Users after removing email field:", await userModel.getAll());
   // Output: Removes the "email" field from each user in the collection

   // Example 7: Remove a user based on filter
   await userModel.removeEntry({ name: "John" });
   console.log("All Users after removing John:", await userModel.getAll());
   // Output: Removes the user with the name "John" from the users collection.
})();
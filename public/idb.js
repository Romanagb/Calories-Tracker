//Shai Shillo ID: 204684914, Roman Agbyev ID: 322002098, Ofek Daida ID 315143958
let idb = {};
window.idb = idb;

//Class definition for the dbinstance we return and work with through our app
//Objects from this class store a db, and the prototype holds the addCalories and getReport methods
class DbInstance{
    constructor() {
        this.db = null;
    }
}

//DB initialization function
idb.openCaloriesDB = async function openCaloriesDB(dbName, dbVersion) {
    return new Promise((resolve, reject) => {
        //Create a DbInstance object that will store the db upon success
        let dbInstance = new DbInstance();

        //Try to open the DB
        const request = window.indexedDB.open(dbName, dbVersion);

        //Failed to open the DB, reject with an error
        request.onerror = function(event) {
            reject(`Error opening database`);
        };

        //Succeeded to open the DB, store it into DbInstance object db property and send the object through resolve
        request.onsuccess = function(event) {
            dbInstance.db = event.target.result;
            resolve(dbInstance);
        };

        //Update the DB
        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            db.createObjectStore(`caloriesdb`, { keyPath: `id`, autoIncrement: true });
            dbInstance.db = db;
        };
    });
}

//Add calories item function
//Assigned to the DbInstance prototype to allow wanted invoke
DbInstance.prototype.addCalories = async function(caloriesItem) {
    return new Promise((resolve, reject) => {
        //Get the current date to use for report generation, split and store the relevant values as numbers
        const currentDate = new Date()
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth() + 1; //Adding 1 to get month in range 1-12
        const currentYear = currentDate.getFullYear();

        //Add the current date to the calorie item
        caloriesItem.day = currentDay;
        caloriesItem.month = currentMonth;
        caloriesItem.year = currentYear;

        //Try writing
        const transaction = this.db.transaction([`caloriesdb`], `readwrite`);
        const store = transaction.objectStore(`caloriesdb`);
        const request = store.add(caloriesItem);

        //Failed to write, reject with an error
        request.onerror = function(event) {
            reject(`Error adding calorie item`);
        };

        //Succeeded, resolve and put a message to the console
        request.onsuccess = function(event) {
            resolve(`Calorie item added successfully`);
        };
    });
}

//Get report function, returns the report as an array with the relevant items,
//Assigned to the DbInstance prototype to allow wanted invoke
DbInstance.prototype.getReport = async function(month, year) {
    return new Promise((resolve, reject) => {
        //Try to get all the items stored in our DB
        const transaction = this.db.transaction([`caloriesdb`], `readonly`);
        const store = transaction.objectStore(`caloriesdb`);
        const request = store.getAll();


        //Failed, reject with an error
        request.onerror = function(event) {
            console.error(`Error occurred while fetching report data:`, event.target.error);
            reject(`Error getting report`);
        };

        //Succeeded, filter them for the relevant items only, resolve with those in an array
        request.onsuccess = function(event) {
            const allCalories = event.target.result;
            const relevantCalories = allCalories.filter((item) =>
                item.month === month && item.year === year);

            resolve(relevantCalories);
        };
    });
}

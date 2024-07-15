const express = require("express"),
       app = express(),
       port = process.env.PORT || 8080,
       cors = require("cors");
const bodyParser = require('body-parser');
const fsPromises = require("fs").promises;
const todoDBName = "tododb";
const useCloudant = false;



//Init code for Cloudant

//Initialize backend
app.use(cors());
app.use(bodyParser.json({ extended: true }));

app.listen(port, () => console.log("Backend server live on " + port));

app.get("/", (request, response) => {
    response.send({ message: "Connected to Backend server!" });
});

//add new item to json file
app.post("/add/item", addItem)

async function addItem (request, response) {
    try {
        // Converting Javascript object (Task Item) to a JSON string
        const id = request.body.jsonObject.id
        const task = request.body.jsonObject.task
        const curDate = request.body.jsonObject.currentDate
        const dueDate = request.body.jsonObject.dueDate
        const newTask = {
          ID: id,
          Task: task,
          Current_date: curDate,
          Due_date: dueDate
        }
        
        if (useCloudant) {
            //begin here for cloudant

            
        } else {
            //write to local file
            const data = await fsPromises.readFile("database.json");
            const json = JSON.parse(data);
            json.push(newTask);
            await fsPromises.writeFile("database.json", JSON.stringify(json))
            console.log('Successfully wrote to file') 
        }
        response.sendStatus(200)
    } catch (err) {
        console.log("error: ", err)
        response.sendStatus(500)
    }
}

//** week 6, get all items from the json database*/
app.get("/get/items", getItems)
async function getItems (request, response) {
    //begin here
    // read in the todo lists stored in the database.json file:
    var data = await fsPromises.readFile("database.json");
    // Return a response to whoever called the data we just read in, we will return the data from the file but parsed as JSON data:
    response.json(JSON.parse(data));

};

//** week 6, search items service */
app.get("/get/searchitem", searchItems) 
async function searchItems (request, response) {
    //begin here
    // retrieve a parameter passed to this service, this parameter will be the name of the Todo List we will search for
    var searchField = request.query.taskname;
    // read in the database
    var json = JSON.parse (await fsPromises.readFile("database.json"));
    // take the data from the database and apply a filter stored in "searchField"
    var returnData = json.filter(jsondata => jsondata.Task === searchField);
    // return a response (doesn't matter if we have anything or not)
    response.json(returnData);
};


// Add initDB function here


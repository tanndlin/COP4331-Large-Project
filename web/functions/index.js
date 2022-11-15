//import libraries
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require('cors');  
//const { user } = require("firebase-functions/v1/auth");

//initialize firebase in order to access its services
admin.initializeApp(functions.config().firebase);

//initialize express server
const app = express();

//initialize the database and the collection 
const db = admin.firestore();
const userCollection = 'users';
const billCollection = 'bills';
const budgetCollection = 'budgets';
const categoryCollection = 'categories';
const oneOffCollection = 'oneOffs';

//define google cloud function name
exports.webApi = functions.https.onRequest(app);

//initialize CORS for app
app.use(
    cors({
        origin: "*",
    })
);

//create user profile
app.post('/CreateUserProfile', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    try{

        const userId = req.body.userId;
        const expectedIncome = parseInt(req.body.expectedIncome); 

        //when a new user signs up, they will be added to the userCollection
        await db.collection(userCollection).doc(`${userId}`).set({});
        const userRef = db.collection(userCollection).doc(`${userId}`);

        const newProfile = {
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "expectedIncome": expectedIncome,
        }

        //add the user's profile to the database
        await userRef.update(newProfile);

        res.status(200).send(JSON.stringify({
            "userId": userId, 
            "firstName": req.body.firstName, 
            "lastName": req.body.lastName, 
            "expectedIncome": expectedIncome
        }));

    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
});

//get user profile info
app.post('/GetUserProfile', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    try{

        const userId = req.body.userId;
        const userRef = await db.collection('users').doc(`${userId}`).get();
        
        //if the user exists, then get the profile info for said user
        if(userRef.exists) {
            const firstName = userRef.get("firstName");
            const lastName = userRef.get("lastName");
            const expectedIncome = userRef.get("expectedIncome");
            res.status(200).send(JSON.stringify({
                "userId": userId, 
                "firstName": firstName, 
                "lastName": lastName, 
                "expectedIncome": expectedIncome
            }));
        }
        else {
            res.status(400).send("User doesn't exist");
        }

    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
});

//edit user profile
app.post('/EditUserProfile', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    try{

        const userId = req.body.userId;
        const expectedIncome = parseInt(req.body.expectedIncome); 
        const userRef = await db.collection('users').doc(`${userId}`).get();
        
        //if the user exists, then edit the profile info for said user
        if(userRef.exists) {
            const newProfile = {
                "firstName": `${req.body.firstName}`,
                "lastName": `${req.body.lastName}`,
                "expectedIncome": `${expectedIncome}`,
            }

            //add the user's profile to the database
            await db.collection('users').doc(`${userId}`).update(newProfile);

            res.status(201).send(`{"userId": "${userId}", "firstName": "${req.body.firstName}", "lastName": "${req.body.lastName}", "expectedIncome": ${req.body.expectedIncome}}`);
        }
        else {
            res.status(400).send("User doesn't exist");
        }
        
    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
});

//delete user profile
app.post('/RemoveUserProfile', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    try{

        const userId = req.body.userId;
        const userRef = await db.collection('users').doc(`${userId}`).get();
        
        //if the user exists, then delete the user
        if(userRef.exists) {
            await db.collection('users').doc(`${userId}`).delete();
            res.status(200).send(`User has been deleted`);
        }
        else {
            res.status(400).send("User doesn't exist");
        }

    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
});

//create bill
app.post('/CreateBill', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    try {

        const userId = req.body.userId; 
        const userRef = db.collection(userCollection).doc(`${userId}`);

        //make price string into an integer
        const price = parseInt(req.body.price);

        var isPaid = req.body.isPaid;

        const newBill = {
            "name": req.body.name,
            "categoryId": req.body.categoryId,
            "color": req.body.color,
            "price": price,
            "startDate": req.body.startDate,
            "endDate": req.body.endDate,
            "recurrence": req.body.recurrence,
            "isPaid": isPaid
        }

        const billDoc = userRef.collection(billCollection).doc();
        const billId = billDoc.id;
        await billDoc.set(newBill);

        const editedBill = {
            "name": req.body.name,
            "categoryId": req.body.categoryId,
            "color": req.body.color,
            "price": price,
            "startDate": req.body.startDate,
            "endDate": req.body.endDate,
            "recurrence": req.body.recurrence,
            "isPaid": isPaid,
            "billId": billId
        }

        await userRef.collection(billCollection).doc(`${billId}`).update(editedBill);

        res.status(201).send(JSON.stringify({
            "userId": userId,
            "billId": billId,
            "name": req.body.name,
            "categoryId": req.body.categoryId,
            "color": req.body.color,
            "price": price,
            "startDate": req.body.startDate,
            "endDate": req.body.endDate,
            "recurrence": req.body.recurrence,
            "isPaid": isPaid
        }));

    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
});

//get bills
app.post('/GetBills', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    try {

        const userId = req.body.userId; 
        const userRef = db.collection(userCollection).doc(`${userId}`); 

         //check if the one-off already exists
         const billDocs = await userRef.collection(billCollection).get();
         if(!billDocs.empty) {

            var bills = billDocs.docs.map(curBill => {
                var isPaid = curBill.get("isPaid");

                return {
                    "name": curBill.get("name"),
                    "categoryId": curBill.get("categoryId"),
                    "color": curBill.get("color"),
                    "price": curBill.get("price"),
                    "startDate": curBill.get("startDate"),
                    "endDate": curBill.get("endDate"),
                    "recurrence": curBill.get("recurrence"),
                    "isPaid": isPaid,
                    "billId": curBill.id
                }
            })

            res.status(200).send(JSON.stringify({
                "userId": userId,
                "bills": bills
            }));
        }
         else {
            res.status(400).send("There are no existing bills");
         }

    } catch (error) {
        res.status(400).send(`${error.message}`);
    } 
});

//edit bill
app.post('/EditBill', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    try {

        const userId = req.body.userId;
        const userRef = db.collection(userCollection).doc(`${userId}`);
        const billId = req.body.billId; 

        //check if the bill already exists
        const billExist = await userRef.collection(billCollection).doc(`${billId}`).get();
        if(!billExist.exists){
            res.status(400).send("This bill doesn't exist")
        }

        const price = parseInt(req.body.price);

        var isPaid = req.body.isPaid;

        const editedBill = {
            "name": req.body.name,
            "categoryId": req.body.categoryId,
            "color": req.body.color,
            "price": price,
            "startDate": req.body.startDate,
            "endDate": req.body.endDate,
            "recurrence": req.body.recurrence,
            "isPaid": isPaid,
            "billId": billId
        }

        await userRef.collection(billCollection).doc(`${billId}`).update(editedBill);
        
        res.status(200).send(JSON.stringify({
            "userId": userId,
            "billId": billId,
            "name": req.body.name,
            "categoryId": req.body.categoryId,
            "color": req.body.color,
            "price": price,
            "startDate": req.body.startDate,
            "endDate": req.body.endDate,
            "recurrence": req.body.recurrence,
            "isPaid": isPaid
        }));

    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
});

//remove bill
app.post('/RemoveBill', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    try {

        const userId = req.body.userId; 
        const userRef = db.collection(userCollection).doc(`${userId}`);
        const billId = req.body.billId;
        const billDoc =  await userRef.collection(billCollection).doc(`${billId}`).get();

        if(billDoc.exists) {
            await userRef.collection(billCollection).doc(`${billId}`).delete();
            res.status(200).send(JSON.stringify({"userId": userId, "billId":  `${billId} has been deleted`}));
        }
        else {
            res.status(400).send("Bill doesn't exist")
        }

    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
});

//create budget
app.post('/CreateBudget', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    try {

        const userId = req.body.userId; 
        const userRef = db.collection(userCollection).doc(`${userId}`);

        //make expectedPrice string into an integer
        const expectedPrice = parseInt(req.body.expectedPrice);

        //make actualPrice string into an integer
        const actualPrice = parseInt(req.body.actualPrice);

        const newBudget = {
            "name": req.body.name,
            "categoryId": req.body.categoryId,
            "expectedPrice": expectedPrice,
            "actualPrice": actualPrice,
            "startDate": req.body.startDate,
            "recurrence": req.body.recurrence
        }

        const budgetDoc = userRef.collection(budgetCollection).doc();
        const budgetId = budgetDoc.id;
        await budgetDoc.set(newBudget);

        const editedBudget = {
            "name": req.body.name,
            "categoryId": req.body.categoryId,
            "expectedPrice": expectedPrice,
            "actualPrice": actualPrice,
            "startDate": req.body.startDate,
            "recurrence": req.body.recurrence,
            "budgetId":budgetId
        }

        await userRef.collection(budgetCollection).doc(`${budgetId}`).update(editedBudget);
        res.status(201).send(JSON.stringify({
            "userId": userId,
            "budgetId": budgetId,
            "name": req.body.name,
            "categoryId": req.body.categoryId,
            "expectedPrice": expectedPrice,
            "actualPrice": actualPrice,
            "startDate": req.body.startDate,
            "recurrence": req.body.recurrence
        }));

    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
});

//get budgets
app.post('/GetBudgets', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    try {

        const userId = req.body.userId; 
        const userRef = db.collection(userCollection).doc(`${userId}`); 

         //check if the one-off already exists
         const budgetDocs = await userRef.collection(budgetCollection).get();
         if(!budgetDocs.empty) {

            var budgets = budgetDocs.docs.map(curBudget => {
                return {
                    "name": curBudget.get("name"),
                    "categoryId": curBudget.get("categoryId"),
                    "expectedPrice": curBudget.get("expectedPrice"),
                    "actualPrice": curBudget.get("actualPrice"),
                    "startDate": curBudget.get("startDate"),
                    "recurrence": curBudget.get("recurrence"),
                    "budgetId": curBudget.id
                }
            })

            res.status(200).send(JSON.stringify({
                "userId": userId,
                "budgets": budgets
            }));
        }
         else {
            res.status(400).send("There are no existing budgets");
         }

    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
});

//edit budget
app.post('/EditBudget', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    try {

        const userId = req.body.userId; 
        const userRef = db.collection(userCollection).doc(`${userId}`);
        const budgetId = req.body.budgetId; 

        //check if the budget already exists
        const budgetExist = await userRef.collection(budgetCollection).doc(`${budgetId}`).get();
        if(!budgetExist.exists){
            res.status(400).send("This budget doesn't exist");
        }

        const expectedPrice = parseInt(req.body.expectedPrice);
        const actualPrice = parseInt(req.body.actualPrice);

        const editedBudget = {
            "name": req.body.name,
            "categoryId": req.body.categoryId,
            "expectedPrice": expectedPrice,
            "actualPrice": actualPrice,
            "startDate": req.body.startDate,
            "recurrence": req.body.recurrence,
            "budgetId": budgetId
        }

        await userRef.collection(budgetCollection).doc(`${budgetId}`).update(editedBudget);
        res.status(200).send(JSON.stringify({
            "userId": userId,
            "budgetId": budgetId,
            "name": req.body.name,
            "categoryId": req.body.categoryId,
            "expectedPrice": expectedPrice,
            "actualPrice": actualPrice,
            "startDate": req.body.startDate,
            "recurrence": req.body.recurrence
        }));

    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
});

//remove budget
app.post('/RemoveBudget', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    try {

        const userId = req.body.userId; 
        const userRef = db.collection(userCollection).doc(`${userId}`);
        const budgetId = req.body.budgetId; 
        const budgetDoc = await userRef.collection(budgetCollection).doc(`${budgetId}`).get();

        if(budgetDoc.exists) {
            await userRef.collection(budgetCollection).doc(`${budgetId}`).delete();
            res.status(200).send(JSON.stringify({
                "userId": userId, 
                "budgetId": `${budgetId} has been deleted`
            }));
        }
        else {
            res.status(400).send("Budget doesn't exist")
        }

    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
});

//create one-off
app.post('/CreateOneOff', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    try {

        const userId = req.body.userId;
        const userRef = db.collection(userCollection).doc(`${userId}`);

        //make price string into an integer
        const price = parseInt(req.body.price);

        //object for a new one-off
        const newOneOff = {
            "name": req.body.name,
            "categoryId": req.body.categoryId,
            "color": req.body.color,
            "price": price,
            "date": req.body.date
        }

        const oneOffDoc = userRef.collection(oneOffCollection).doc();
        const oneOffId = oneOffDoc.id;
        await oneOffDoc.set(newOneOff);

        const editedOneOff = {
            "name": req.body.name,
            "categoryId": req.body.categoryId,
            "color": req.body.color,
            "price": price,
            "date": req.body.date,
            "oneOffId": `${oneOffId}`
        }

        await userRef.collection(oneOffCollection).doc(`${oneOffId}`).update(editedOneOff);

        res.status(201).send(JSON.stringify({
            "userId": userId,
            "oneOffId": oneOffId,
            "name": req.body.name,
            "categoryId": req.body.categoryId,
            "color": req.body.color,
            "price": price,
            "date": req.body.date
        }));

    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
});

//get one-offs
app.post('/GetOneOffs', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    try {

        const userId = req.body.userId; 
        const userRef = db.collection(userCollection).doc(`${userId}`); 

         //check if the one-off already exists
         const oneOffDocs = await userRef.collection(oneOffCollection).get();
         if(!oneOffDocs.empty) {

            const oneOffs = oneOffDocs.docs.map((curOneOff) => {
                return {
                    name: curOneOff.get('name'),
                    categoryId: curOneOff.get('categoryId'),
                    color: curOneOff.get('color'),
                    price: curOneOff.get('price'),
                    date: curOneOff.get('date'),
                    oneOffId: curOneOff.id,
                };
            });

            res.status(200).send(JSON.stringify({
                "userId": userId,
                "oneOffs": oneOffs
            }));
        }
         else {
            res.status(400).send("There are no existing one-offs");
         }

    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
});

//edit one-off
app.post('/EditOneOff', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    try {

        const userId = req.body.userId;
        const userRef = db.collection(userCollection).doc(`${userId}`);
        const oneOffId = req.body.oneOffId;

        //get name of the one-off
        var oneOffExist = await userRef.collection(oneOffCollection).doc(`${oneOffId}`).get();

        //if this one-off collection or the specific one-off doesn't exist
        if(!oneOffExist.empty) {

            //make price string into an integer
            const price = parseInt(req.body.price);

            const editedOneOff = {
                "name": req.body.name,
                "categoryId": req.body.categoryId,
                "color": req.body.color,
                "price": price,
                "date": req.body.date,
                "oneOffId": oneOffId
            }

            await userRef.collection(oneOffCollection).doc(`${oneOffId}`).update(editedOneOff);

            res.status(201).send(JSON.stringify({
                "userId": userId,
                "oneOffId": oneOffId,
                "name": req.body.name,
                "categoryId": req.body.categoryId,
                "color": req.body.color,
                "price": price,
                "date": req.body.date
            }));
        }
        else {
            res.status(400).send("This one-off doesn't exist");
        }

    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
});

//delete one-off
app.post('/RemoveOneOff', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    try {

        const userId = req.body.userId; 
        const userRef = db.collection(userCollection).doc(`${userId}`);
        const oneOffId = req.body.oneOffId;
        const oneOffDoc =  await userRef.collection(oneOffCollection).doc(`${oneOffId}`).get();

        if(oneOffDoc.exists) {
            await userRef.collection(oneOffCollection).doc(`${oneOffId}`).delete();
            res.status(200).send(JSON.stringify({
                "userId": userId, 
                "oneOffId": `${oneOffId} has been deleted`
            }));
        }
        else {
            res.status(400).send("One-off doesn't exist")
        }

    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
   
});

//create category
app.post('/CreateCategory', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    try {

        const userId = req.body.userId;
        const userRef = db.collection(userCollection).doc(`${userId}`);
        const nameInput = req.body.name;
        const categoryName = nameInput.toUpperCase(); 

        //get category of the bill
        var categoryExist = await userRef.collection(categoryCollection).where('name', '==', `${categoryName}`).get();

        //if this category collection or the specific category doesn't exist
        if(categoryExist.empty) {

            //make a new category
            const newCategory = {
                "name": categoryName
            }
    
            //add it to the category table
            var categoryDoc = userRef.collection(categoryCollection).doc();
            var categoryId = categoryDoc.id;
            await categoryDoc.set(newCategory);

            const editedCategory = {
                "name": categoryName,
                "categoryId": categoryId
            }

            await categoryDoc.update(editedCategory);

            res.status(201).send(JSON.stringify({
                "userId": userId,
                "categoryName": categoryName,
                "categoryId": categoryId
            }));
        }
        else {
            res.send("This category already exists");
        }

    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
});

//get categories
app.post('/GetCategories', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    try {

        const userId = req.body.userId; 
        const userRef = db.collection(userCollection).doc(`${userId}`); 

         //check if the one-off already exists
         const categoryDocs = await userRef.collection(categoryCollection).get();
         if(!categoryDocs.empty) {

            var categories = categoryDocs.docs.map(curCategory => {
                return {
                    "name": curCategory.get("name"),
                    "categoryId": curCategory.id
                }
            })

            res.status(200).send(JSON.stringify({
                "userId": userId,
                "categories": categories
            }));
        }
         else {
            res.status(400).send("There are no existing categories");
         }

    } catch (error) {
        res.status(400).send(`${error.message}`);
    }
});
const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const morgan = require( 'morgan' );
const mongoose = require( 'mongoose' );
const validateToken = require( './middleware/validateToken' );
const { Students } = require( './models/studentModel' );
const {DATABASE_URL, PORT} = require( './config' );

const app = express();
const jsonParser = bodyParser.json();

app.use( express.static( 'public' ) );
app.use( morgan( 'dev' ) );
app.use( validateToken );

let listOfStudents = [
    {
        name : "Marcel",
        id : 123
    },
    {
        name : "Martha",
        id : 456
    },
    {
        name : "Julieta",
        id : 789
    },
    {
        name: "Alfredo",
        id : 847
    }
];

app.get( '/api/students', ( req, res ) => {
    console.log( "Getting all students." );

    Students
        .getAllStudents()
        .then( result => {
            return res.status( 200 ).json( result );
        })
        .catch( err => {
            res.statusMessage = "Something is wrong with the Database. Try again later.";
            return res.status( 500 ).end();
        })

});

app.get( '/api/studentById', ( req, res ) => {
    console.log( "Getting a student by id using the query string." );

    console.log( req.query );

    let id = req.query.id; 

    if( !id ){
        res.statusMessage = "Please send the 'id' as parameter.";
        return res.status( 406 ).end();
    }

    let result = listOfStudents.find( ( student ) => {
        if( student.id ===  Number( id ) ){
            return student;
        }
    });

    if( !result ){
        res.statusMessage = `There are no students with the provided 'id=${id}'.`;
        return res.status( 404 ).end();
    }

    return res.status( 200 ).json( result ); 
});

app.get( '/api/getStudentById/:id', ( req, res ) => {
    console.log( "Getting a student by id using the integrated param." );
    console.log( req.params );

    let id = req.params.id;

    let result = listOfStudents.find( ( student ) => {
        if( student.id === Number( id ) ){
            return student;
        }
    });

    if( !result ){
        res.statusMessage = `There are no students with the provided 'id=${id}'.`;
        return res.status( 404 ).end();
    }

    return res.status( 200 ).json( result ); 
});

app.post( '/api/createStudent', jsonParser, ( req, res ) => {
    console.log( "Adding a new student to the list." );
    console.log( "Body ", req.body );

    let name = req.body.name;
    let id = req.body.id;

    if( !id || !name ){
        res.statusMessage = "One of these parameters is missing in the request: 'id' or 'name'.";
        return res.status( 406 ).end();
    }

    if( typeof(id) !== 'number' ){
        res.statusMessage = "The 'id' MUST be a number.";
        return res.status( 409 ).end();
    }
    
    let newStudent = { name, id };

    Students
        .createStudent( newStudent )
        .then( result => {
            // Handle id duplicate error
            if( result.errmsg ){
                res.statusMessage = "The 'id' belongs to another student. " +
                                    result.errmsg;
                return res.status( 409 ).end();
            }
            return res.status( 201 ).json( result ); 
        })
        .catch( err => {
            res.statusMessage = "Something is wrong with the Database. Try again later.";
            return res.status( 500 ).end();
        });
});

app.delete( '/api/removeStudent', ( req, res ) => {
    
    let id = req.query.id;

    if( !id ){
        res.statusMessage = "Please send the 'id' to delete a student";
        return res.status( 406 ).end();
    }

    let itemToRemove = listOfStudents.findIndex( ( student ) => {
        if( student.id === Number( id ) ){
            return true;
        }
    });

    if( itemToRemove < 0 ){
        res.statusMessage = "That 'id' was not found in the list of students.";
        return res.status( 400 ).end();
    }

    listOfStudents.splice( itemToRemove, 1 );
    return res.status( 204 ).end();
});

app.listen( PORT, () => {
    console.log( "This server is running on port 8080" );

    new Promise( ( resolve, reject ) => {

        const settings = {
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useCreateIndex: true
        };
        mongoose.connect( DATABASE_URL, settings, ( err ) => {
            if( err ){
                return reject( err );
            }
            else{
                console.log( "Database connected successfully." );
                return resolve();
            }
        })
    })
    .catch( err => {
        console.log( err );
    });
});


// Base URL : http://localhost:8080/
// GET endpoint : http://localhost:8080/api/students
// GET by id in query : http://localhost:8080/api/studentById?id=123
// GET by id in param : http://localhost:8080/api/getStudentById/123


// Run mongo server
// brew services start mongodb-community
// mongod

// Use the mongo shell
// mongo
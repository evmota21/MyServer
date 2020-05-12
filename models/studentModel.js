const mongoose = require( 'mongoose' );

const studentsSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    id : {
        type : Number,
        required : true,
        unique : true
    }
});

const studentsCollection = mongoose.model( 'students', studentsSchema );

const Students = {
    createStudent : function( newStudent ){
        return studentsCollection
                .create( newStudent )
                .then( createdStudent => {
                    return createdStudent;
                })
                .catch( err => {
                    return err;
                });
    },
    getAllStudents : function(){
        return studentsCollection
                .find()
                .then( allStudents => {
                    return allStudents;
                })
                .catch( err => {
                    return err;
                });
    }
}

module.exports = { Students };
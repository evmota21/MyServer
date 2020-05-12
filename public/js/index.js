const API_TOKEN = "password12345";
let errorHandling = document.querySelector( '.errorHandling' );


function fetchAddStudents( name, id){
    let url="/api/createStudent";
    let data = {
        name : name,
        id : Number(id)
    };
    let settings = {
        method : 'POST',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            'Content-Type' :'application/json'
        },
        body : JSON.stringify( data )
    }

    let results = document.querySelector( '.results' );

    fetch( url, settings)
        .then( response => {
            if(response.ok){
                return response.json();
            }
            
            throw new Error( response.statusText );
        })
        .then( responseJSON => {

            errorHandling.innerHTML= "";
            

            results.innerHTML += `<div> ${responseJSON.name} </div>`;
        })
        .catch( err => {
            errorHandling.innerHTML = err.message;
        })
}
function fetchStudents(){

    let url="/api/students";

    let settings = {
        method: 'GET',
        headers: {
            Authorization : `Bearer ${API_TOKEN}`
        }
    }

    let results = document.querySelector( '.results' );
    fetch( url, settings)
        .then( response => {
            if(response.ok){
                return response.json();
            }
            
            throw new Error( response.statusText );
        })
        .then( responseJSON => {

            results.innerHTML = "";
            errorHandling.innerHTML= "";

            for(let i = 0; i < responseJSON.length; i++){
                results.innerHTML += `<div> ${responseJSON[i].name} </div>`;
            }
        })
        .catch( err => {

            errorHandling.innerHTML = err.message;
        })
}

function watchAddStudentForm(){
    let addStudentsForm = document.querySelector( '.add-student-form' );
    addStudentsForm.addEventListener( 'submit' , (event => {
        event.preventDefault();
        console.log("clicked add students button");

        let name = document.getElementById( 'studentName' ).value;
        let id = document.getElementById( 'studentID' ).value;

        fetchAddStudents( name, id);

    }))
}


function watchStudentsGetForm(){
    let getStudentsForm = document.querySelector( '.get-students-form' );
    getStudentsForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        console.log( "CLicked the button" );

        fetchStudents();
    })
}

function init(){
    watchStudentsGetForm();
    watchAddStudentForm();
}

init();


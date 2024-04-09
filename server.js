const express = require('express');
const inquirer = require('inquirer');

const {Pool} = require('pg');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const pool = new Pool(
    {
        user: 'postgres',
        password: 'password123',
        host: 'localhost',
        database: 'employee_db'
    },

)

pool.connect();


function question(){
    inquirer
    .prompt({
        type: 'list',
        name: 'inital',
        message: 'Please choose from the following:',
        choices: ['View all departments', 'View all roles', 'View all employees',
        'Add a department', 'Add a role', 'Add a employee', 'Update an employee role' ]
    })
}
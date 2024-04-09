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
    console.log('Connected to employee_db')

)

pool.connect();


function question(){
    inquirer
    .prompt({
        type: 'list',
        name: 'initial',
        message: 'Please make a following selection:',
        choices: ['View all departments', 'View all roles', 'View all employees',
        'Add a department', 'Add a role', 'Add a employee', 'Update an employee role' ]
    })

    .then((data) => {
        if (data.initial === 'view all departments') {
           const department = 'SELECT * FROM department;';
           pool.query(department, function(err, {rows}){
            console.table(rows);
        
        
           })
        } else if (data.initial === 'view all roles') {
           const role = 'SELECT * FROM role;';
          pool.query(role, function(err, {rows}){
            console.table(rows);
        
        
          })
        } else if (data.initial === 'view all employees'){
           
           const employees = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.id, department.name, employee.manager_id   
                              FROM employee
                              JOIN role ON role.id = employee.role_id
                            JOIN department ON department.id = role.department_id;`
          pool.query(employees, function(err, {rows}){
        console.table(rows);
        
        
        })
        } else if (data.initial === 'add a department') {
            inquirer
            .prompt({
                type: 'input',
                name: 'departName',
                message:  'Enter the name of the department'
            }
            )
            .then((data) => {
               pool.query(`INSERT INTO department (name) VALUES ($1) RETURNING id, name;`, [data.departName], function(err, { rows }){
                 console.log(rows);
                 console.table(rows);
                })
        
        
            })
            .catch((err) => console.log(err));
        
        
        } else if (data.initial ==='add a role'){
            inquirer
            .prompt([{
                type: 'input',
                name: 'title',
                message: 'Enter the position name/title'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary'
            },
            {
                type: 'input',
                name: 'departName',
                message: 'Enter the department id'
        
            }]
        )
            .then((data) => {
                pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING id, title, salary, department_id;', [data.title, data.salary, data.departName], function(err, {rows}){
                    console.table(rows);
                })
            })
            .catch((err) => console.log(err));
        
        
        }   else if (data.initial ==='add an employee'){
            inquirer
            .prompt([{
                type: 'input',
                name: 'fName',
                message: 'Enter the first name'
            },
            {
                type: 'input',
                name: 'lName',
                message: 'Enter the last name'
            },
            {
                type: 'input',
                name: 'managerid',
                message: 'Enter manager id'
            },
            {
                type: 'input',
                name: 'roleid',
                message: 'Enter role id'
            }]
        )
        .then((data) => {
            pool.query('INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, manager_id, role_id;', [data.fName, data.lName, data.managerid, data.roleid], function(err, result){
                
                if (err) {
                    console.error("Error executing query:");
                    return;
                  }
                  const { rows } = result;
                  console.table(rows);
        
            })
        })
        .catch((err) => console.log(err));
        
        
        } else if (data.initial === 'update an employee role') {
            inquirer
            .prompt([{
                type: 'input',
                message: 'Enter the employee id to select an employee to update and their new role',
                name: 'employeeid'
            },
            {
                type: 'input',
                name: 'role',
                message: 'Enter the role id'
            }]
        )
        .then((data) => {
             const allEmployee = `SELECT * FROM employee WHERE employee.id =${data.employeeid} ;`;
             const update = 'UPDATE employee SET role_id = $1 WHERE employee.id = $2';
             pool.query(allEmployee,  function(err, {rows}){
                console.table(rows);
                pool.query(update, [data.role, data.employeeid], function(err, {rows}){
                    console.table(rows);
                })
            })
        })
        .catch((err) => console.log(err));
        }
        
        
        } )
        .catch((err) => console.log(err));
        };
        
        question();
        
        
        
        
        
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
          });
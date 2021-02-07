# Employee Tracker 
`````````````````````````````
Using the command-line interface, this application will allow a business owner to view and manage the departments, roles, and employees of their company, including:
`````````````````````````````
* Every department of the company
* All roles of the company, including salary and department
* All employees of the company, their role, salary and managers that the employees report to
* Add a department, role or employee 
* Delete departments, roles and employees
```````````````
```````````````
## Install: 
````````
* npm install
* npm install inquirer
* npm install console.table --save
* npm install dotenv

## Instructions
```````````````
Next, to execute the functionality of this application enter the following in your CLI:

mysql -u root -p < db/schema.sql (then enter your password)
this creates the employee tracker database and tables
mysql -u root -p < db/seeds.sql (then enter your password)
this populates the database tables with the departments, roles and employees
execute the application with node server


const mysql = require("mysql2");
const cTable = require("console.table");
const inquirer = require("inquirer");
const util = require("util");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  // Your MySQL usesrname
  user: "root",
  password: " ",
  database: "companyDB",
});

connection.connect((err) => {
    if (err) throw err;
    console.log("");
    start();
  });
  
  // Promisify connection query with util.promisify to allow async to be used
  const queryAsync = util.promisify(connection.query).bind(connection);
  
  // Prompt user with choices and switch between functions based on answers
  async function start() {
    const answer = await inquirer.prompt({
      name: "select",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View departments",
        "View roles",
        "View employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Delete a department",
        "Delete a role",
        "Delete an employee",
        "Exit",
    ],
});
switch (answer.select) {
  case "View departments":
    viewDepartments();
    break;
  case "View roles":
    viewRoles();
    break;
  case "View employees":
    viewEmployees();
    break;
  case "Add a department":
    addDepartment();
    break;
  case "Add a role":
    addRole();
    break;
  case "Add an employee":
    addEmployee();
    break;
  case "Delete a department":
    deleteDepartment();
    break;
  case "Delete a role":
    deleteRole();
    break;
  case "Delete an employee":
    deleteEmployee();
    break;
  case "Exit":
    console.log("");
    connection.end();
    break;
  }
}
    
// console.table everything in departments table
async function viewDepartments() {
    const sql = await queryAsync("SELECT * FROM departments");
    const departments = [];
    console.log("");
    for (let i of sql) {
      departments.push({ ID: i.id, NAME: i.name });
    }
    console.table(departments);
    start();
  }
  
  // console.table everything in roles table
  async function viewRoles() {
    const sql = await queryAsync(
      "SELECT roles.id, roles.title, roles.salary, departments.name FROM roles INNER JOIN departments ON roles.departmentID = departments.id"
    );
    const roles = [];
    console.log("");
    for (let i of sql) {
      roles.push({
        ID: i.id,
        TITLE: i.title,
        SALARY: i.salary,
        DEPARTMENT: i.name,
      });
    }
    console.table(roles);
    start();
  }
  
// console.table everything in employees table
async function viewEmployees() {
    const sql = await queryAsync(
      "SELECT e.id, CONCAT(e.firstName, ' ', e.lastName) AS employeeName, roles.title, roles.salary, CONCAT(m.firstName, ' ', m.lastName) AS managerName FROM employees e LEFT JOIN employees m ON m.id = e.managerID INNER JOIN roles ON e.roleID = roles.id"
    );
    const employees = [];
    console.log("");
    for (let i of sql) {
      employees.push({
        ID: i.id,
        NAME: i.employeeName,
        ROLE: i.title,
        SALARY: i.salary,
        MANAGER: i.managerName,
      });
    }
    console.table(employees);
    start();
  }
  
  // add new department to departments table
  async function addDepartment() {
    const answer = await inquirer.prompt({
      name: "newDepartment",
      type: "input",
      message: "What is the name of the new department?",
    });
    await queryAsync("INSERT INTO departments SET ?", {
      name: answer.newDepartment,
    });
    console.log("-------------------------");
    console.log("New department was added!");
    console.log("-------------------------");
    viewDepartments();
  }

// add new role to roles table
async function addRole() {
    const sql = await queryAsync("SELECT * FROM departments");
    const answer = await inquirer.prompt([
      {
        name: "newRole",
        type: "input",
        message: "What is the new role you want to add?",
      },
      {
        name: "salary",
        type: "input",
        message: "What is the salary for the new role?",
        validate: (value) => {
          if (isNaN(value) === false) return true;
          return false;
        },
      },
      {
        name: "department",
        type: "list",
        message: "What department is the new role in?",
        choices: () => {
          const departments = [];
          for (let i of sql) {
            departments.push(i.name);
          }
          return departments;
        },
      },
    ]);
    let departmentID;
    for (let i of sql) {
      if (i.name === answer.department) {
        departmentID = i.id;
      }
    }
    await queryAsync("INSERT INTO roles SET ?", {
        title: answer.newRole,
        salary: answer.salary,
        departmentID: departmentID,
      });
      console.log("-------------------");
      console.log("New role was added!");
      console.log("-------------------");
      viewRoles();
    }
    
    // add new employee to employees table
    async function addEmployee() {
      const sqlRole = await queryAsync("SELECT * FROM roles");
      const answerRole = await inquirer.prompt([
        {
          name: "firstName",
          type: "input",
          message: "What is the new employee's first name?",
        },
        {
          name: "lastName",
          type: "input",
          message: "What is the new employee's last name?",
        },
        {
          name: "role",
          type: "list",
          message: "What is the new employee's role?",
          choices: () => {
            const roles = [];
            for (let i of sqlRole) {
              roles.push(i.title);
            }
            return roles;
          },
        },
      ]);
      const sqlEmployee = await queryAsync(
        "SELECT employees.id, CONCAT(employees.firstName, ' ', employees.lastName) AS employeeName, employees.roleID, employees.managerID FROM employees"
      );
      const answerEmployee = await inquirer.prompt({
        name: "employee",
        type: "list",
        message: "Who is the new employee's manager?",
        choices: () => {
          const names = ["None"];
          for (let i of sqlEmployee) {
            names.push(i.employeeName);
          }
          return names;
        },
      });
      let roleID;
      for (let i of sqlRole) {
        if (i.title === answerRole.role) {
          roleID = i.id;
        }
      }
      let managerID;
      for (let i of sqlEmployee) {
        if (i.employeeName === answerEmployee.employee) {
          managerID = i.id;
        }
      }
      await queryAsync("INSERT INTO employees SET ?", {
        firstName: answerRole.firstName,
        lastName: answerRole.lastName,
        roleID: roleID,
        managerID: managerID,
      });
      console.log("-----------------------");
      console.log("New employee was added!");
      console.log("-----------------------");
      viewEmployees();
    }
   
// delete department from departments table
async function deleteDepartment() {
    const sql = await queryAsync("SELECT * FROM departments");
    const answer = await inquirer.prompt({
      name: "deleteDepartment",
      type: "list",
      message: "Which department would you like to delete?",
      choices: () => {
        const departments = [];
        for (let i of sql) {
          departments.push(i.name);
        }
        return departments;
      },
    });
  
    await queryAsync("DELETE FROM departments WHERE ?", {
      name: answer.deleteDepartment,
    });
    console.log("-----------------------");
    console.log("Department was deleted!");
    console.log("-----------------------");
    viewDepartments();
  }
  
  // delete role from roles table
  async function deleteRole() {
    const sql = await queryAsync("SELECT * FROM roles");
    const answer = await inquirer.prompt({
      name: "deleteRole",
      type: "list",
      message: "Which role would you like to delete?",
      choices: () => {
        const roles = [];
        for (let i of sql) {
          roles.push(i.title);
        }
        return roles;
      },
    });

    await queryAsync("DELETE FROM roles WHERE ?", { title: answer.deleteRole });
    console.log("-----------------");
    console.log("Role was deleted!");
    console.log("-----------------");
    viewRoles();
  }
  
  // delete employee from employees table
  async function deleteEmployee() {
    const sql = await queryAsync("SELECT employees.id, CONCAT(employees.firstName, ' ', employees.lastName) AS employeeName, employees.roleID, employees.managerID FROM employees");
    const answer = await inquirer.prompt({
      name: "deleteEmployee",
      type: "list",
      message: "Which employee would you like to delete?",
      choices: () => {
        const employees = [];
        for (let i of sql) {
          employees.push(i.employeeName);
        }
        return employees;
      },
    });
    let deleteID;
    for (let i of sql) {
      if (i.employeeName === answer.deleteEmployee) {
        deleteID = i.id;
      }
    }
  
    await queryAsync("DELETE FROM employees WHERE ?", { id: deleteID });
    console.log("---------------------");
    console.log("Employee was deleted!");
    console.log("---------------------");
    viewEmployees();
  }
      
       
    
  
  
  
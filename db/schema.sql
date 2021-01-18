DROP DATABASE IF EXISTS companyDB;
CREATE DATABASE companyDB;

USE companyDB;

DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS roles;


CREATE TABLE department(
    id INTEGER(11) AUTO_INCREMENT NOT NULL,
    name VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE roles(
    id INTEGER(11) AUTO_INCREMENT NOT NULL,
    title VARCHAR(30), NOT NULL,
    salary DECIMAL(8,2),
    department_id INTEGER NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(department_id) REFERENCES department(id) 

);

CREATE TABLE employee(
    id INTEGER(11) AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER NOT NULL,
    manager_id INTEGER NULL,
    FOREIGN KEY(role_id) REFERENCES roles(id),
    FOREIGN KEY(manager_id) REFERENCES employee(id)
    
);

SELECT * FROM department;
SELECT * FROM roles;
SELECT * FROM employee;
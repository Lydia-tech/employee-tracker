-- INNER JOIN will only return all matching values from both tables
SELECT roles.id, roles.title, roles.salary, department.name
FROM roles
JOIN department ON roles.department_id = department.id;

SELECT roles.id, roles.title, roles.salary, departments.name FROM roles INNER JOIN departments ON roles.departmentID = departments.id;

-- LEFT JOIN returns all of the values from the left table, and the matching ones from the right table
SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, roles.title, roles.salary
FROM employee
LEFT JOIN roles ON employee.role_id = roles.id;

-- RIGHT JOIN returns all of the values from the right table, and the matching ones from the left table
SELECT department.id, department.name
FROM department
RIGHT JOIN employee ON employee.id = department.id;


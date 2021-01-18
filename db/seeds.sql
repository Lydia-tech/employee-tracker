USE companyDB;

INSERT INTO department (name)
VALUES ('Engineering'), ('Finance'), ('Legal'), ('Sales');

INSERT INTO roles (title, salary, department_id)
Values
    ('Sales Lead', 900000, 1),
    ('Salesperson', 80000, 1),
    ('Lead Engineer', 100000, 4),
    ('Software Engineer', 130000, 4),
    ('Account Manager', 150000, 3),
    ('Accountant', 120000, 3),
    ('Legal Team Lead', 200000, 2),
    ('Lawyer', 200000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Jim', 'Beam', 4, null),
    ('Elijah', 'Craig', 3, null),
    ('Jack', 'Daniels', 5, null),
    ('Samuel', 'Smith', 3, null),
    ('James', 'Pepper', 4, null),
    ('Mark', 'Maker', 2, 4),
    ('Abraham', 'Bowman', 3, 5),
    ('James', 'Oliver', 4, 5);

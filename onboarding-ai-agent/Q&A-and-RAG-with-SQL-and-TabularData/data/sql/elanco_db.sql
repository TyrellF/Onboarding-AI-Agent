
/*******************************************************************************
   Drop Foreign Keys Constraints
********************************************************************************/
 
 
/*******************************************************************************
   Drop Tables
********************************************************************************/
DROP TABLE IF EXISTS [Department];       
 
DROP TABLE IF EXISTS [Employee];
 
DROP TABLE IF EXISTS [access_control];
 
DROP TABLE IF EXISTS [onboarding_task];
 
DROP TABLE IF EXISTS [assigned_task];
 
DROP TABLE IF EXISTS [learning_materials];
 
 
/*******************************************************************************
   Create Tables
********************************************************************************/
 
CREATE TABLE department (
    department_id INT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL
);
 
CREATE TABLE employee (
    employee_id INT PRIMARY KEY,
    employee_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department_id INT,
    start_date DATE NOT NULL,
    job_level_id INT,
    FOREIGN KEY (department_id) REFERENCES department(department_id),
    FOREIGN KEY (job_level_id) REFERENCES access_control(job_level_id)
);
 
CREATE TABLE access_control (
    job_level_id INT PRIMARY KEY,
    access_type VARCHAR(50) NOT NULL
);
 
CREATE TABLE onboarding_task (
    task_id INT PRIMARY KEY,
    task_name VARCHAR(100) NOT NULL,
    description TEXT
);
 
CREATE TABLE assigned_task (
    assigned_task_id INT PRIMARY KEY,
    task_id INT,
    employee_id INT,
    department_id INT,
    status VARCHAR(50) CHECK (status IN ('pending', 'in_progress', 'completed')) NOT NULL,
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES onboarding_task(task_id),
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
    FOREIGN KEY (department_id) REFERENCES department(department_id)
);
 
CREATE TABLE learning_materials (
    material_id INT PRIMARY KEY,
    department_id INT,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    url VARCHAR(255),
    FOREIGN KEY (department_id) REFERENCES department(department_id)
);
 
 
/*******************************************************************************
   Create Primary Key Unique Indexes
********************************************************************************/
 
/*******************************************************************************
   Create Foreign Keys
********************************************************************************/
/******************************************************************************
*   Create Foreign Keys Indexes
******************************************************************************/
 
CREATE INDEX [IFK_EmployeeDeptId] ON [employee] ([department_id]);
CREATE INDEX [IFK_EmployeeJobLevelId] ON [employee] ([job_level_id]);
 
CREATE INDEX [IFK_AssignedTaskTaskId] ON [assigned_task] ([task_id]);
CREATE INDEX [IFK_AssignedTaskEmpId] ON [assigned_task] ([employee_id]);
CREATE INDEX [IFK_AssignedTaskDeptId] ON [assigned_task] ([department_id]);
 
CREATE INDEX [IFK_LearningMaterialsDeptId] ON [learning_materials] ([department_id]);
 
/*******************************************************************************
   Populate Tables
********************************************************************************/
 
-- Insert Departments
INSERT INTO department (department_id, department_name) VALUES
(1, 'Human Resources'),
(2, 'Engineering'),
(3, 'Marketing'),
(4, 'Sales'),
(5, 'IT'),
(6, 'Finance'),
(7, 'Operations'),
(8, 'Legal'),
(9, 'Product'),
(10, 'Customer Support'),
(11,'Data and Engineering'),
(12,'ERG');
 
-- Insert Access Control Levels
INSERT INTO access_control (job_level_id, access_type) VALUES
(1, 'Intern'),
(2, 'Associate manager'),
(3, 'Analyst'),
(4, 'Senior Associate manage'),
(5, 'Tech lead'),
(6, 'Developer'),
(7, 'Senior Developer'),
(8, 'Tester'),
(9, 'Associate Director'),
(10, 'Director');
 
-- Insert Employees
INSERT INTO employee (employee_id, employee_name, email, department_id, start_date, job_level_id) VALUES
(1, 'Alice Johnson', 'alice.johnson@example.com', 2, '2024-09-01', 3),
(2, 'Bob Smith', 'bob.smith@example.com', 5, '2024-08-15', 5),
(3, 'Clara Adams', 'clara.adams@example.com', 1, '2024-10-05', 2),
(4, 'David Lee', 'david.lee@example.com', 3, '2024-07-20', 4),
(5, 'Eva Gomez', 'eva.gomez@example.com', 4, '2024-11-11', 6),
(6, 'Frank Turner', 'frank.turner@example.com', 6, '2024-12-01', 1),
(7, 'Grace Kim', 'grace.kim@example.com', 7, '2024-06-10', 7),
(8, 'Henry Nguyen', 'henry.nguyen@example.com', 8, '2024-05-01', 8),
(9, 'Ivy Chen', 'ivy.chen@example.com', 9, '2024-04-21', 9),
(10, 'Jack Patel', 'jack.patel@example.com', 10, '2024-03-18', 10);
 
-- Insert Onboarding Tasks
INSERT INTO onboarding_task (task_id, task_name, description) VALUES
(1, 'Submit Documents', 'Submit all required personal documents'),
(2, 'Attend Orientation', 'Participate in company orientation'),
(3, 'Setup Email', 'Setup company email account'),
(4, 'Read Policies', 'Go through company policies'),
(5, 'Setup Workstation', 'Configure hardware and software'),
(6, 'Meet Team', 'Meet with team and manager'),
(7, 'Join Slack', 'Join internal communication channels'),
(8, 'Setup Payroll', 'Enter banking details'),
(9, 'Install Tools', 'Install development or business tools'),
(10, 'Security Training', 'Complete basic security awareness training');
 
-- Insert Assigned Tasks
INSERT INTO assigned_task (assigned_task_id, task_id, employee_id, department_id, status, last_update) VALUES
(1, 1, 1, 2, 'pending', '2025-04-01 10:00:00'),
(2, 2, 2, 5, 'in_progress', '2025-04-05 09:15:00'),
(3, 3, 3, 1, 'completed', '2025-04-10 15:30:00'),
(4, 4, 4, 3, 'in_progress', '2025-04-08 11:00:00'),
(5, 5, 5, 4, 'pending', '2025-04-12 13:45:00'),
(6, 6, 6, 6, 'completed', '2025-04-04 16:20:00'),
(7, 7, 7, 7, 'pending', '2025-04-07 10:30:00'),
(8, 8, 8, 8, 'in_progress', '2025-04-09 17:10:00'),
(9, 9, 9, 9, 'completed', '2025-04-11 14:00:00'),
(10, 10, 10, 10, 'pending', '2025-04-06 08:25:00');
 
-- Insert Learning Materials
INSERT INTO learning_materials (material_id, department_id, title, description, url) VALUES
(1, 2, 'Engineering Handbook', 'Introduction to engineering processes', 'http://example.com/eng-guide'),
(2, 5, 'IT Policies', 'IT security and usage policies', 'http://example.com/it-policy'),
(3, 1, 'HR Onboarding Guide', 'Overview of HR policies and procedures', 'http://example.com/hr-guide'),
(4, 3, 'Marketing Playbook', 'Strategy and tools used in marketing', 'http://example.com/mkt-playbook'),
(5, 4, 'Sales CRM Training', 'How to use CRM tools effectively', 'http://example.com/sales-crm'),
(6, 6, 'Finance Orientation', 'Financial procedures and systems', 'http://example.com/finance-guide'),
(7, 7, 'Operations Manual', 'Standard operating procedures', 'http://example.com/ops-manual'),
(8, 8, 'Legal Compliance 101', 'Basics of legal compliance', 'http://example.com/legal-basics'),
(9, 9, 'Product Strategy Doc', 'Roadmap and planning materials', 'http://example.com/product-strategy'),
(10, 10, 'Support Tools Training', 'Tutorials on using support tools', 'http://example.com/support-training');
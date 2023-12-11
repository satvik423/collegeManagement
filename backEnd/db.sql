CREATE DATABASE IF NOT EXISTS university;

USE university;

CREATE TABLE IF NOT EXISTS faculty_details (
    faculty_id VARCHAR(20) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    gender VARCHAR(10),
    post VARCHAR(50),
    contact_number VARCHAR(15),
    email VARCHAR(255),
    department VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS department_details (
  dept_id VARCHAR(20) PRIMARY KEY,
  dept_name VARCHAR(225) NOT NULL
);

CREATE TABLE IF NOT EXISTS subject_details (
  subject_code VARCHAR(255) PRIMARY KEY,
  subject_name VARCHAR(255) NOT NULL,
  semester VARCHAR(255) NOT NULL,
  dept_id VARCHAR(255),
  FOREIGN KEY (dept_id) REFERENCES department_details(dept_id)
);

CREATE TABLE IF NOT EXISTS student_details (
  student_id VARCHAR(20) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  gender VARCHAR(10) NOT NULL,
  contact_number VARCHAR(15) NOT NULL,
  email VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,
  semester VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS login_detail (
  user_id VARCHAR(20) PRIMARY KEY,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS mark_details (
    student_id VARCHAR(20),
    subject_name VARCHAR(255),
    semester VARCHAR(20),
    exam VARCHAR(10),
    marks INT,
    PRIMARY KEY (student_id, subject_name, exam),
    FOREIGN KEY (student_id) REFERENCES student_details(student_id)
);
SELECT student_id, full_name FROM student_details WHERE semester = "I sem" AND department = "MCA";
select *from mark_details;



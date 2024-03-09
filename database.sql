-- Create the Candidates table
CREATE TABLE Candidates (
  candidate_id SERIAL PRIMARY KEY, -- Auto-incrementing integer for unique ID
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL, -- Ensure unique email addresses
  phone VARCHAR(20),
  current_status VARCHAR(25) CHECK (current_status IN ('Contacted', 'Interview Scheduled', 'Offer Extended', 'Hired', 'Rejected')),
  expected_salary DECIMAL(10,2)
);

-- Create the Skills table
CREATE TABLE Skills (
  skill_id SERIAL PRIMARY KEY,
  skill_name VARCHAR(255) NOT NULL UNIQUE -- Ensure unique skill names
);

-- Create the Candidate_Skills table (Many-to-Many relationship)
CREATE TABLE Candidate_Skills (
  candidate_id INTEGER REFERENCES Candidates(candidate_id) NOT NULL,
  skill_id INTEGER REFERENCES Skills(skill_id) NOT NULL,
  PRIMARY KEY (candidate_id, skill_id) -- Composite primary key for unique pairings
);

-- Optional Experience table (One-to-Many relationship with Candidates)
CREATE TABLE Experience (
  experience_id SERIAL PRIMARY KEY,
  candidate_id INTEGER REFERENCES Candidates(candidate_id) NOT NULL,
  company_name VARCHAR(255),
  job_title VARCHAR(255),
  skill_name VARCHAR(255) NOT NULL REFERENCES Skills(skill_name), -- Foreign key to reference existing skills
  years_of_experience INTEGER,
  start_date DATE,
  end_date DATE
);

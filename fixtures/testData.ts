/**
 * Test Data Fixtures
 * 
 * Centralized test data for use across test suites
 */

export const TestUsers = {
  validAdmin: {
    username: 'Admin',
    password: 'admin123',
  },
  invalidUser: {
    username: 'InvalidUser',
    password: 'wrongpassword',
  },
  emptyCredentials: {
    username: '',
    password: '',
  },
};

export const EmployeeTestData = {
  validEmployee: {
    firstName: 'John',
    middleName: 'Michael',
    lastName: 'Doe',
    employeeId: 'EMP001',
  },
  minimalEmployee: {
    firstName: 'Jane',
    lastName: 'Smith',
  },
};

export const UserManagementTestData = {
  newUser: {
    userRole: 'Admin',
    employeeName: 'Odis  Adalwin',
    status: 'Enabled',
    username: 'testuser',
    password: 'Test@123456',
  },
  searchCriteria: {
    userRole: 'Admin',
    status: 'Enabled',
  },
};

export const PIMSearchCriteria = {
  byName: {
    employeeName: 'Odis',
  },
  byId: {
    employeeId: '0001',
  },
  multipleCriteria: {
    employmentStatus: 'Full-Time Permanent',
    jobTitle: 'Software Engineer',
  },
};

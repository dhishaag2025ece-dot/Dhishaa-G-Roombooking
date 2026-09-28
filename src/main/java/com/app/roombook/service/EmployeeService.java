package com.app.roombook.service;

import com.app.roombook.entity.Employee;
import com.app.roombook.exception.ResourceNotFoundException;
import com.app.roombook.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public Employee createEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee with ID " + id + " not found."
                        )
                );
    }

    public Employee updateEmployee(
            Long id,
            Employee employeeDetails) {

        Employee employee = getEmployeeById(id);

        employee.setName(employeeDetails.getName());
        employee.setEmail(employeeDetails.getEmail());
        employee.setPassword(employeeDetails.getPassword());
        employee.setDepartment(employeeDetails.getDepartment());

        return employeeRepository.save(employee);
    }

    public void deleteEmployee(Long id) {

        Employee employee = getEmployeeById(id);

        employeeRepository.delete(employee);
    }

    public Employee login(
            String email,
            String password) {

        return employeeRepository
                .findByEmailAndPassword(email, password)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"
                        )
                );
    }
}
import { createSlice } from "@reduxjs/toolkit";
import { setMonth } from "date-fns";

export const employeeSlice = createSlice({
    name: 'employee',
    initialState: {
        employees: null,
        editEmployeeData: null,
    },
    reducers: {
        setEmployee: (state, action) => {
            state.employees = action.payload
        },
        deleteEmployeeById: (state, action) => {
            const data = state.employees.data
            state.employees.data = data.filter(employee => employee.id !== action.payload);
        },
        updateEmployeeById: (state, action) => {
            const updatedData = action.payload;
            state.employees.data = state.employees.data.map(employee =>
                employee.id === updatedData.id ? updatedData : employee
            );
        },
        setEditEmployeeData: (state, action) => {
            state.editEmployeeData = action.payload
        }
    }
})

export const { setEmployee, deleteEmployeeById, updateEmployeeById, setEditEmployeeData } = employeeSlice.actions

export default employeeSlice.reducer
import axios from "axios";
import Cookies from "js-cookie";

const getAllData = async (url) => {
	try {
		const response = await axios.get(
			`${import.meta.env.VITE_API_BASE_URL}/${url}`,
			{
				headers: {
					Authorization: `Bearer ${Cookies.get("auth_session")}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error("Error fetching data:", error);
		return null;
	}
};

const getDataById = async (url) => {
	try {
		const response = await axios.get(`${url}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching data:", error);
		return null;
	}
};

const addData = async (url, data, token) => {
	try {
		const response = await axios.post(
			`${import.meta.env.VITE_API_BASE_URL}/${url}`,
			data,
			{
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error("Error adding data:", error);
		return null;
	}
};

const addDataSchedule = async (url, data) => {
	try {
		const response = await axios.post(
			`${import.meta.env.VITE_API_BASE_URL}/${url}`,
			data,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${Cookies.get("auth_session")}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error("Error adding data:", error);
		return null;
	}
};

const updateData = async (url, data) => {
	try {
		const response = await axios.put(
			`${import.meta.env.VITE_API_BASE_URL}/${url}`,
			data
		);
		return response.data;
	} catch (error) {
		console.error("Error updating data:", error);
		return null;
	}
};

const deleteData = async (url) => {
	try {
		const response = await axios.delete(
			`${import.meta.env.VITE_API_BASE_URL}/${url}`
		);
		return response.data;
	} catch (error) {
		console.error("Error deleting data:", error);
		return null;
	}
};

const Login = async ({ data }) => {
	try {
		const response = await axios.post(
			`${import.meta.env.VITE_API_BASE_URL}/auth/login`,
			{
				email: data.email,
				password: data.password,
			}
		);
		return response.data;
	} catch (error) {
		console.error("Error login:", error);
		return null;
	}
};

const register = async ({ data }) => {
	try {
		const response = await axios.post(
			`${import.meta.env.VITE_API_BASE_URL}/auth/register`,
			data
		);
		return response.data;
	} catch (error) {
		console.error("Error login:", error);
		return null;
	}
};

export {
	getAllData,
	getDataById,
	addData,
	updateData,
	deleteData,
	Login,
	addDataSchedule,
	register,
};

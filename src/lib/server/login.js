import { LOGIN_USERNAME, LOGIN_PASSWORD } from '$env/static/private';

const username = LOGIN_USERNAME;
const password = LOGIN_PASSWORD;

export async function login({ username: u, password: p }) {
    if (u === username && p === password) {
        return {
            status: 200,
            body: { message: 'Login successful' }
        };
    } else {
        return {
            status: 401,
            body: { message: 'Login failed' }
        };
    }
}
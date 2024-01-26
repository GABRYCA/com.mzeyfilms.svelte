import { v4 as uuidv4 } from 'uuid';
import { create, find, remove } from '$lib/store';

export const getUserByUsername = async (username) => {
    const existingUser = find({
        username: username
    });
    if (!existingUser) return Promise.resolve(null);
    return Promise.resolve(existingUser);
};

export const getUserById = async (id) => {
    const existingUser = find({ id: id });
    if (!existingUser) return Promise.resolve(null);
    return Promise.resolve(existingUser);
};

export const isAuthenticated = async (id) => {
    const existingUser = find({ id: id });
    if (!existingUser) return Promise.resolve(false);
    return Promise.resolve(true);
}

export const createSession = (username,password) => {
    const session = {
        id: uuidv4(),
        username,
        password
    };
    const response = create(session);
    if(!response || response.id === null) {
        // Get user by username
        return getUserByUsername(username);
    }
    return Promise.resolve(response);
}

export const deleteSession = (id) => {
    const existingUser = find({ id: id });
    if (!existingUser) return true;
    remove(id);
    return true;
}
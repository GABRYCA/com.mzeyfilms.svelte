import { writable } from 'svelte/store';
import { USER_DEFAULT_ID, USER_DEFAULT_USERNAME, USER_DEFAULT_PASSWORD } from '$env/static/private';

export const user = writable([
    {
        id: USER_DEFAULT_ID,
        username: USER_DEFAULT_USERNAME,
        password: USER_DEFAULT_PASSWORD
    }
]);
export const create = (newUser) => {
    const userExist = find({ username: newUser.username})
    if(userExist) {
        return false;
    }
    user.update((u) => [...u, newUser]);
    return newUser;
};
export const remove = (id) => {
    user.update((u) => u.filter((u) => u.id !== id));
};
export const find = (obj) => {
    let existingUser;
    user.subscribe((value) => {
        if (value) {
            if (obj.username) {
                existingUser = value.find((item) => item.username === obj.username);
            } else {
                existingUser = value.find((item) => item.id === obj.id);
            }
        }
    });
    return existingUser;
};
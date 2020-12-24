let users = [];
function userJoin(id, username, room) {
    const user = { id, username, room };
    users.push(user);
    return user;
}
function getCurrentUser(id) {
    return users.find(el => el.id === id);
}
function getAllUsersOfRoom(room) {
    return users.filter(el => el.room === room);
}
function removeUser(id) {
    return users = users.filter(el => el.id !== id);
}
module.exports = {
    getAllUsersOfRoom,
    userJoin,
    getCurrentUser,
    removeUser
}
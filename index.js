const Requests = require('./requests')
const file_path = 'database';
const requests = new Requests(file_path);

(async () => {
    try {
        await requests.create_table();

        await requests.add_user('John Doe', 'john.doe@example.com', 'password123');

        const users = await requests.get_users();
        console.log(users);
    } catch (e) {
        console.error(e);
    }
})();


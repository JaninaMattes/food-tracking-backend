import User from "#root/models/User";

const testUserData = {
    username: "James",
    password: "123456_123456",
};

const run = async () => {
    try {
        await User.deleteMany({});

        // save test User
        let lisa = new User(testUserData);
        await lisa.save();
    } catch (err) {
        console.error("Couldn't insert Testdata:", err);
    }
};

export default run;

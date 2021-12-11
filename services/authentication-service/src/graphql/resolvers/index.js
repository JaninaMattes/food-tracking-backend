import User from "#root/models/User";
var jwt = require("jsonwebtoken");

// authenticate user
const resolvers = {
    Mutation: {
        async login(_, { username, password }, { res }) {
            try {
                let user = await User.findOne({ username });

                user.comparePassword(password, (err, isMatch) => {
                    if (err) throw err;
                    console.log(password, isMatch);
                });

                const token = jwt.sign(
                    { username, id: user.id },
                    process.env.JWT_SECRET,
                    {
                        algorithm: "HS256",
                        expiresIn: "1d",
                    }
                );

                return token;
            } catch (err) {
                console.error(err);
                throw err;
            }
        },

        async signup(_, { username, password }, { res }) {
            try {
                let newUser = {
                    username,
                    password,
                };

                let user = new User(newUser);
                user = await user.save();

                const token = jwt.sign(
                    { username: user.username, id: user.id },
                    process.env.JWT_SECRET,
                    {
                        algorithm: "HS256",
                        expiresIn: "1d",
                    }
                );

                return token;
            } catch (err) {
                console.error(err);
                throw err;
            }
        },
    },
};

export default resolvers;

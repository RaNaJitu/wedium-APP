const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config('.env.local');
const { getUserByPhone, getUserdata, createUser, updateUserById, deleteUserById } = require('../User/function');
// user signup
const signup = async (req, res, next) => {
    try {
        const body = req.body;
        // Validate user input
        if (!(body.phone && body.password)) {
            res.status(404).json("All input is required");
        }
        const data = {phone: body.phone, email : body.email}
        // check if user already exist by phone
        const oldUserData = await getUserdata(data);
        if (oldUserData != 0) {
            return res.status(409).json("User Already Exist. Please Login");
        } else {
            // Encrypt user password
            encryptedPassword = await bcrypt.hash(body.password, 5);
            const options = {
                name: body.name,
                email: body.email.toLowerCase(), // sanitize: convert email to lowercase
                password: encryptedPassword,
                phone: body.phone,
            };
            // Create user in our database
            const user = await createUser(options);
            const token = jwt.sign({ User_id: user._id, User_email: user.email, role: user.role }, process.env.TOKEN_SECRET);
            res.status(200).json({ userDetails: user, token });
        }
    } catch (err) {
        console.log(err);
    }
};

// user login
const login = async (req, res, next) => {
    try {
        // Get user input
        const body = req.body;
        // Validate user input
        if (!(body.phone && body.password)) {
            res.status(404).json("All input is required");
        }
        // Validate if user exist in our database
        const user = await getUserByPhone(body.phone);
        if (user && (await bcrypt.compare(body.password, user.password))) {
            // Create token
            const token = jwt.sign(
                { User_id: user._id, User_phone: user.phone, role: user.role },
                process.env.TOKEN_SECRET,
                {
                    expiresIn: "24h",
                }
            );
            res.header("auth-token", token).json({ "token": token });
            user.token = token;
            const updatedUser = await updateUserById(user._id, {
                $set: { active: true },
            });
            return [true, updatedUser, token];
        }
        res.status(400).json({message: "Invalid Credentials"});
    } catch (err) {
        console.log(err);
    }
};

const generateOtp = async (req, res) => {
    const contact = pass.contact;
    const otp = await otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, alphabets: false });
    const options = { authorization: FAST2SMS_API_KEY, message: `Your OTP is ${otp}`, numbers: [8888888888, 9999999999, 6666666666] };
    const message = await fast2sms.sendMessage(options) //Asynchronous Function.
    const user = new user({
        contact,
        otp
    })
    user.save()
        .then(result => {
            console.log(otp);
            console.log(result);
            message,
                res.end();
        })
}

// user location
const location = async (req, res) => {
    try {
        // console.log('***********locaton***********88',Country.getAllCountries())
        // console.log('***********locaton***********88',State.getAllStates())
        // let States = getStates('in');
        // console.log('*************************',States);
        // const countries = Countries.getCountries({ locale: 'it' })
        // const location = await getLocation(phone);
        res.status(200).json({
            data: location,
            status: true,
            message: null
        })
    } catch (err) {
        console.log(err);
    }
};

//  update user
const updateUser = async (req, res, next) => {
    const data = req.body;

    if (!data) {
        return res
            .status(404)
            .json({ message: "Data to update can not be empty" })
    }
    const id = req.params.id;
    await updateUserById(id, data)
        .then(data => {
            if (!data) {
                res.status(404).json({ message: `Cannot Update User with ${id}. Maybe User not found!` })
            } else {
                res.status(200).json({ message: " Successfully Updated User Role" })
            }
        })
        .catch(err => {
            res.status(500).json({ message: "Error Update User Role" })
        })
}

//  delete user
const deleteUser = async (req, res, next) => {
    const id = req.params.id;
    await deleteUserById(id)
        .then(data => {
            if (!data) {
                res.status(404).json({ message: `Cannot Delete with id ${id}. Maybe id is wrong` })
            } else {
                res.status(200).json({
                    message: "user was deleted successfully!"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "Could not delete user with id=" + id
            });
        });
}

module.exports = {
    signup,
    login,
    updateUser,
    deleteUser,
    location
};
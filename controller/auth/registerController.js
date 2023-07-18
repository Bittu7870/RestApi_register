import Joi from "joi";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import userModel from "../../models/user";
import bcrypt from 'bcrypt';
import jwtService from "../../services/JwtService";

const registerController = {
  async register(req, res, next) {
    // CHECKLIST
    // [+] Validate the request
    // [+] Authorized the request 
    // [+] Check if user is in the database already
    // [+] Prepare model
    // [+] Store in database 
    // [+] Generate the jwt token
    // [+] Send response

    // Validation 
    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(
          new RegExp('^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{3,30}$')
        )
        .required(),
      repeat_password: Joi.ref('password')
    });

    const { error } = registerSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    // Check if user is in the database already
    try {
      const email = req.body.email;    
      const exist = await userModel.getUserData(email);    
      if (exist.length > 0) {
        return next(CustomErrorHandler.alreadyExits("This email is already exists"));
      }
    } 
    catch (err) {
      return next(err);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Prepare for data insertion
    const userData = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    };

    // Insert user data into the database
    let access_token ;
    try {
      const insertedUser = await userModel.insertUserData(userData);
      console.log('Inserted user:', insertedUser);

    // Generate the jwt token
      access_token = jwtService.sign({ id: insertedUser.insertId,});

    } 
    catch (err) {
      return next(err);
    }

    res.json({ access_token : access_token });
  }
};

export default registerController;

import { DEBUG_MODE } from '../config';
import { ValidationError } from 'joi';
import CustomErrorHandler from '../services/CustomErrorHandler';

const errorHandler = (err, req, res, next) => {

    // default error message
    let statusCode = 500;
    let data = {
        message : "Internal server error",
        ...(DEBUG_MODE === 'true' && {originalError : err.message})
    }

    // Validation error message
    if(err instanceof ValidationError){
        statusCode = 400;
        data = {
            message : err.message
        }
    }

    // custom Error message
    if(err instanceof CustomErrorHandler){
        statusCode = err.status;
        data = {
            message : err.message
        }
    }

    return res.status(statusCode).json(data)
    
}
export default errorHandler; 
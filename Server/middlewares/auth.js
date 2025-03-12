import { TryCatch} from "../middlewares/error.js";
import jwt from "jsonwebtoken";
import { ErrorHandler } from '../utils/utility.js';

// Middleware for checking if user is authenticated
const isAuthenticated = TryCatch((req, res, next) => {
    const token = req.cookies["Globe-token"];
    if (!token)
      return next(new ErrorHandler("Please login to access this route", 401));
  
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  
req.user = decodedData._id;
  
    next();
  });

export { isAuthenticated };

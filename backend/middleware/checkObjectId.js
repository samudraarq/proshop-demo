import { isValidObjectId } from "mongoose";

const checkObjectId = (req, res, next) => {
  // check if id is a valid ObjectId
  if (!isValidObjectId(req.params.id)) {
    throw new Error(`Invalid ObjectId of: ${req.params.id}`);
  }
  next();
};

export default checkObjectId;

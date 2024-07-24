import { UserModel } from "../model/model.mjs";
import { catchErrorUtility } from "../utility/catch.error.utility.mjs";
import mongoose from "mongoose";
import { payloadValidator } from "../validator/payload.validator.mjs";

export const accountDeletionController = async (request, response) => {
  const { error, value } = payloadValidator.validate(request.body);

  if (error) {
    return response.status(400).json({ responseData: error.message });
  }

  const { userData } = value;
  const session = await mongoose.startSession();

  try {
    const existingUser = await UserModel.exists({
      email: { $eq: userData.email },
    });

    if (!existingUser) {
      return response.status(401).json({ responseData: "User not found!" });
    }

    await session.withTransaction(async () => {
      const database = mongoose.connection.db;
      const collections = await database.listCollections().toArray();

      const deletionPromises = collections.map(async (collection) => {
        if (collection.name !== "users") {
          await database.collection(collection.name).bulkWrite([
            {
              deleteMany: {
                filter: {
                  _id: { $eq: existingUser._id },
                  userId: { $eq: existingUser._id },
                },
                session,
              },
            },
          ]);
        }
      });

      await Promise.all(deletionPromises);
      await UserModel.deleteOne({ _id: { $eq: existingUser._id } }).session(
        session
      );
    });

    return response
      .status(200)
      .json({ responseData: "Account deletion successful!" });
  } catch (error) {
    catchErrorUtility(error, response);
  } finally {
    session.endSession();
  }
};

import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../application/interface/IUserRepository";
import { UserModel } from "../database/models/UserModel";

export class MongoUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ email });
    if (!userDoc) return null;
    return new User({
      id: userDoc._id.toString(),
      email: userDoc.email,
      name: userDoc.name,
      avatar: userDoc.avatar || undefined,
      googleId: userDoc.googleId,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
    });
  }

  async save(user: User): Promise<User> {
    const userData = {
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      googleId: user.googleId,
    };

    let userDoc;
    if (user.id) {
      userDoc = await UserModel.findByIdAndUpdate(user.id, userData, { new: true });
    } else {
      userDoc = await UserModel.create(userData);
    }

    if (!userDoc) throw new Error("Failed to save user");

    return new User({
      id: userDoc._id.toString(),
      email: userDoc.email,
      name: userDoc.name,
      avatar: userDoc.avatar || undefined,
      googleId: userDoc.googleId,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
    });
  }
}

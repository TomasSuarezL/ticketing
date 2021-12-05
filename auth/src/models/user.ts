import mongoose from "mongoose";
import { Password } from "../services/password";

interface UserAttrs {
  email: string;
  password: string;
}

// interface to extend the User model
interface UserModel extends mongoose.Model<UserDoc> {
  build(user: UserAttrs): UserDoc;
}

// interface to extend the User Document model
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
      }
    },
  }
);

// Using 'function' definition to get access to 'this'
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

userSchema.statics.build = (user: UserAttrs) => {
  return new User(user);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };

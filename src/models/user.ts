import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import _, { lowerFirst } from 'lodash';
import * as console from 'console';

const SALT_ROUNDS = 13;

export interface IUser {
    username: string;
    email: string;
    favorites: string[];
}

interface IUserModel extends IUser {
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface IUserDocument extends Document {
    serialize(): IUser;
    comparePassword(password: string): boolean;
}

const userSchema = new Schema<IUserModel & IUserDocument>(
    {
        username: { type: String, required: true, index: { unique: true } },
        email: { type: String, required: true, index: { unique: true } },
        favorites: { type: [String], required: true, default: [] },
        password: { type: String, required: true },
    },
    {
        timestamps: true,
        methods: {
            serialize() {
                return {
                    username: this.username,
                    email: this.email,
                    favorites: this.favorites,
                };
            },
            comparePassword(password: string) {
                return bcrypt.compareSync(password, this.password);
            },
        },
    }
);

userSchema.pre('save', function () {
    if (!this.isModified('password')) return;

    return bcrypt
        .hash(this.password, SALT_ROUNDS)
        .then((hash) => {
            this.password = hash;
        })
        .catch((err: Error) => {
            throw err;
        });
});

const User = model<IUserModel & IUserDocument>('User', userSchema);

export default User;

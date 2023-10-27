import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import _ from 'lodash';

const SALT_ROUNDS = 13;

export interface IUserInformation {
    username: string;
    email: string;
    favorites: string[];
}

export interface IUserBase extends IUserInformation {
    password?: string;
}

export interface IUser extends IUserBase {
    hashedPassword: string;
}

interface IUserDocument extends IUser, Document {
    toUserInformation: () => IUserInformation;
    addFavorite: (station: string) => boolean;
    removeFavorite: (station: string) => boolean;
    setPassword: (password: string) => Promise<void>;
    checkPassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>({
    username: { type: String, required: true, index: { unique: true } },
    email: { type: String, required: true, index: { unique: true } },
    favorites: { type: [String], required: true, default: [] },
    hashedPassword: { type: String, required: true },
});

userSchema.methods.toUserInformation = function (): IUserInformation {
    return { username: this.username, email: this.email, favorites: this.favorites };
};

userSchema.methods.addFavorite = function (station: string) {
    if (this.favorites.includes(station)) return false;

    this.favorites.push(station);

    return true;
};

userSchema.methods.removeFavorite = function (station: string) {
    if (!this.favorites.includes(station)) return false;

    this.favorites.pop(station);

    return true;
};

userSchema.methods.setPassword = async function (password: string) {
    this.hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
};

userSchema.methods.checkPassword = async function (password: string) {
    return await bcrypt.compare(password, this.hashedPassword);
};

const User = model<IUserDocument>('User', userSchema);

export default User;

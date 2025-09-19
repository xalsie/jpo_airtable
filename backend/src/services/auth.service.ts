import { User, TUser } from '../infrastructure/airtable/models';
import { env } from '../config';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Logger from '../utils/logger'

const DUMMY_HASH = bcrypt.hashSync('__dummy_password_for_timing__', 10)

const JWT_SECRET = env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required')
}
export type IAuth = {
    login: (email: string, password: string) => Promise<{ token: string, user: Partial<TUser> } | null>;
    register: (params: {
        email: string,
        password: string,
        firstname: string,
        lastname: string,
        school: string,
        promo: string,
        telephone: string,
        isContacted: boolean
    }) => Promise<{ token: string, user: Partial<TUser> } | { error: string }>;
};

export class AuthService implements IAuth {
    async login(email: string, password: string) {
        const user: any = await User.getAll({  }).then((users: any) => users.find((u: any) => u[User.FieldsIds.email] === email)) as (TUser | null)

        const hashToCompare = user ? user[User.FieldsIds.password] : DUMMY_HASH

        const valid = await bcrypt.compare(password, hashToCompare)

        if (!user || !valid) {
            return null
        }

        const token = jwt.sign({ 
            userId: user.id,
            role: 'role_user'
        }, JWT_SECRET, { expiresIn: env.JWT_EXPIRATION });

        return {
            token,
            user: {
                id: user.id,
                email: user[User.FieldsIds.email],
                firstname: user[User.FieldsIds.firstname],
                lastname: user[User.FieldsIds.lastname],
                avatar: user[User.FieldsIds.avatar],
                school: user[User.FieldsIds.school],
                promo: user[User.FieldsIds.promo],
                telephone: user[User.FieldsIds.telephone],
                isContacted: user[User.FieldsIds.isContacted]
            }
        }
    }

    async register({
        email,
        password,
        firstname,
        lastname,
        school,
        promo,
        telephone,
        isContacted
    }: {
        email: string,
        password: string,
        firstname: string,
        lastname: string,
        school: string,
        promo: string,
        telephone: string,
        isContacted: boolean
    }) {
        try {
            let existingUsers = await User.getAll({  }).then((users: any) => users.filter((u: any) => u[User.FieldsIds.email] === email))

            const hashed = await bcrypt.hash(password, 10)

            if (existingUsers.length > 0) {
                return { error: 'Email already in use' }
            }

            const user = await User.create({
                [User.FieldsIds.email]: email,
                [User.FieldsIds.password]: hashed,
                [User.FieldsIds.isContacted]: isContacted,
                [User.FieldsIds.firstname]: firstname,
                [User.FieldsIds.lastname]: lastname,
                [User.FieldsIds.avatar]: null,
                [User.FieldsIds.school]: school,
                [User.FieldsIds.promo]: promo,
                [User.FieldsIds.telephone]: telephone,
            }) as TUser

            const token = jwt.sign({ userId: user.id, role: 'role_user' }, JWT_SECRET, { expiresIn: env.JWT_EXPIRATION })

            return {
                token,
                user: {
                    id: user.id,
                    email,
                    firstname,
                    lastname,
                    school,
                    promo,
                    telephone,
                    isContacted
                }
            }
        } catch (error) {
            Logger.error('AuthService', 'Error in register:', error)
            throw error
        }
    }
}

export default AuthService

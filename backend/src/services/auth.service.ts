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
    async login(email: string, password: string): Promise<{ token: string, user: Partial<TUser> } | null> {
        const user: TUser | null = await User.getAll({  }).then((users: any) => users.find((u: any) => u.email === email)) as (TUser | null)

        console.log('User found:', user);
        const hashToCompare = user ? user.password : DUMMY_HASH

        console.log('Hash to compare:', password, hashToCompare);

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
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                avatar: user.avatar,
                school: user.school,
                promo: user.promo,
                telephone: user.telephone,
                isContacted: user.isContacted
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
            let existingUsers: TUser[] | null = await User.getAll({  }).then((users: any) => users.filter((u: any) => u.email === email))

            const hashed = await bcrypt.hash(password, 10)

            if (existingUsers && existingUsers.length > 0) {
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
                [User.FieldsIds.telephone]: telephone
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

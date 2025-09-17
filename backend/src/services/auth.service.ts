import { TUser } from '../infrastructure/airtable/models/users';
import { User } from '../infrastructure/airtable/models/users';
import { env } from '../config';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Logger from '../utils/logger' // Adjust the import based on your project structure

const DUMMY_HASH = bcrypt.hashSync('__dummy_password_for_timing__', 10)

const JWT_SECRET = env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required')
}

const AuthService = {
    async login(email: string, password: string) {
        const user = await User.getAll().then(users => users.find(u => u.Email === email)) as (TUser | null)

        // Use a dummy hash to mitigate timing attacks

        const hashToCompare = user ? user.Password : DUMMY_HASH

        const valid = await bcrypt.compare(password, hashToCompare)

        if (!user || !valid) {
            return null
        }

        const token = jwt.sign({ 
            userId: user.id,
            role: 'role_user'
        }, JWT_SECRET, { expiresIn: env.JWT_EXPIRATION });

        return { token, user: { id: user.id, email: user.Email } }
    },

    async register({
        email,
        password,
        confirmPassword,
        FirstName,
        LastName,
        School,
        Promo,
        telephone,
        isContacted
    }: {
        email: string,
        password: string,
        confirmPassword: string,
        FirstName: string,
        LastName: string,
        School: string,
        Promo: string,
        telephone: string,
        isContacted: boolean
    }) {
        try {
            // Check if email already exists
            let existing = await User.getAll().then(users => users.find(u => u.Email === email)) as (TUser | null) // TODO : use View in Airtable to filter only local users

            const hashed = await bcrypt.hash(password, 10)

            if (existing) {
                // Otherwise the email is already taken by a local account
                return { error: 'Email already in use' }
            }

            if (password !== confirmPassword) {
                return { error: 'Passwords do not match' }
            }

            // Create new user
            console.log(email,
        password,
        confirmPassword,
        FirstName,
        LastName,
        School,
        Promo,
        telephone)
            const user = await User.create({
                Email: email,
                Password: hashed,
                // CreatedAt: new Date().toISOString(),
                // UpdatedAt: new Date().toISOString(),
                // CreatedAt format four/moi/année
                // CreatedAt: new Date().toLocaleDateString('fr-FR'),
                // UpdatedAt: new Date().toLocaleDateString('fr-FR'),
                isContacted: isContacted,
                FirstName: FirstName,
                LastName: LastName,
                Avatar: null,
                School: School,
                Promo: Promo,
                telephone: telephone,
            }) as TUser

            const token = jwt.sign({ userId: user.id, role: 'role_user' }, JWT_SECRET, { expiresIn: env.JWT_EXPIRATION })

            return { token, user: { id: user.id, email: user.Email } }
        } catch (error) {
            Logger.error('AuthService', 'Error in register:', error)
            throw error
        }
    },
}

export default AuthService

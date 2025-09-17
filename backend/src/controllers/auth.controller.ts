import fastify, { FastifyInstance } from 'fastify';
// import { TUser } from '../infrastructure/airtable/models/users';
import AuthService from '../services/auth.service';
import Logger from '../utils/logger';
import { env } from '../config';
import { TUser } from '../infrastructure/airtable/models/users';

export class AuthController {
    public static async register(server: FastifyInstance, prefix = '/api/auth') {
        server.post(`${prefix}/register`, {
            schema: {
                body: {
                    type: 'object',
                    required: ['Email', 'Password', 'confirmPassword', 'FirstName', 'LastName', 'School', 'Promo', 'telephone'],
                    properties: {
                    Email: { type: 'string', format: 'email' },
                    Password: { type: 'string', minLength: 6 },
                    confirmPassword: { type: 'string', minLength: 6 },
                    FirstName: { type: 'string' },
                    LastName: { type: 'string' },
                    School: { type: 'string' },
                    Promo: { type: 'string' },
                    telephone: { type: 'string' },
                    isContacted: { type: 'boolean' }
                    }
                }
            }
        }, async (request, reply) => {
            try {
                const body = request.body as (Partial<TUser> & { confirmPassword: string });
                if (!body) {
                    reply.status(400).send({ message: 'Invalid request body' });
                    return;
                }
                
                const {
                    Email,
                    Password,
                    confirmPassword,
                    FirstName,
                    LastName,
                    School,
                    Promo,
                    telephone,
                    isContacted
                } = body;
                
                console.log("body", body)

                const result = await AuthService.register({
                    email: Email || '',
                    password: Password || '',
                    confirmPassword: confirmPassword || '',
                    FirstName: FirstName || '',
                    LastName: LastName || '',
                    School: School || '',
                    Promo: Promo || '',
                    telephone: telephone || '',
                    isContacted: isContacted || false
                })
                if ((result as any).error) {
                    reply.status(409).send({ message: (result as any).error })
                    return
                }

                reply.send(result)
            } catch (error) {
                Logger.error('AuthController', 'Error during register:', error)
                reply.status(500).send({ message: 'Internal server error' })
            }
        })

        server.post(`${prefix}/login`, {
            schema: {
                body: {
                    type: 'object',
                    required: ['Email', 'Password'],
                    properties: {
                        Email: { type: 'string', format: 'email' },
                        Password: { type: 'string', minLength: 6 }
                    }
                }
            }
        }, async (request, reply) => {
            try {
                const body = request.body as { Email: string; Password: string };
                if (!body || !body.Email || !body.Password) {
                    reply.status(400).send({ message: 'Email and password are required' });
                    return;
                }

                const result = await AuthService.login(body.Email, body.Password)
                if ((result as any).error) {
                    reply.status(401).send({ message: (result as any).error })
                    return
                }

                reply.send(result)
            } catch (error) {
                Logger.error('AuthController', 'Error during login:', error)
                reply.status(500).send({ message: 'Internal server error' })
            }
        })
    }
}

export default AuthController;

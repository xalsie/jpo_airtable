import { FastifyInstance } from 'fastify';
import { AuthService } from '../services/auth.service';
import Logger from '../utils/logger';
import { TUser } from '../infrastructure/airtable/models/users';

export class AuthController {
    public static async register(server: FastifyInstance, prefix = '/api/auth') {
        server.post(`${prefix}/register`, {
            schema: {
                body: {
                    type: 'object',
                    required: ['email', 'password', 'firstname', 'lastname', 'school', 'promo', 'telephone'],
                    properties: {
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string', minLength: 6 },
                        firstname: { type: 'string' },
                        lastname: { type: 'string' },
                        school: { type: 'string' },
                        promo: { type: 'string' },
                        telephone: { type: 'string' },
                        isContacted: { type: 'boolean' }
                    }
                }
            }
        }, async (request, reply) => {
            try {
                const body = request.body as (Partial<TUser>);
                if (!body) {
                    reply.status(400).send({ message: 'Invalid request body' });
                    return;
                }

                const {
                    email,
                    password,
                    firstname,
                    lastname,
                    school,
                    promo,
                    telephone,
                    isContacted
                } = body;

                const result = await AuthService.register({
                    email: email || '',
                    password: password || '',
                    firstname: firstname || '',
                    lastname: lastname || '',
                    school: school || '',
                    promo: promo || '',
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
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string', minLength: 6 }
                    }
                }
            }
        }, async (request, reply) => {
            try {
                const body = request.body as { email: string; password: string };
                if (!body || !body.email || !body.password) {
                    reply.status(400).send({ message: 'Email and password are required' });
                    return;
                }

                const result = await AuthService.login(body.email, body.password)
                if (!result) {
                    reply.status(401).send({ message: 'Invalid email or password' });
                    return;
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

import { DefaultSession, DefaultJWT } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      role: 'OWNER' | 'ADMIN'
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role: 'OWNER' | 'ADMIN'
  }
}

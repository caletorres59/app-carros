import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

const USERS = [
  {
    id: '1',
    name: 'Carlos Torres',
    email: process.env.OWNER_EMAIL!,
    password: process.env.OWNER_PASSWORD!,
    role: 'OWNER' as const,
  },
  {
    id: '2',
    name: 'Sara Yepes',
    email: process.env.ADMIN_EMAIL!,
    password: process.env.ADMIN_PASSWORD!,
    role: 'ADMIN' as const,
  },
]

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        const user = USERS.find(
          (u) =>
            u.email === credentials?.email &&
            u.password === credentials?.password
        )
        if (!user) return null
        return { id: user.id, name: user.name, email: user.email, role: user.role }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as typeof USERS[0]).role
      return token
    },
    session({ session, token }) {
      if (session.user) session.user.role = token.role as 'OWNER' | 'ADMIN'
      return session
    },
  },
  pages: { signIn: '/login' },
})

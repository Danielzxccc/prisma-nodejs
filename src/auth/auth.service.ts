import { User } from 'prisma/prisma-client'
import { prisma } from '../../db/prisma'
import bcrypt from 'bcrypt'

export async function createUser(): Promise<User> {
  const hashedPwd = await bcrypt.hash('admin123', 10)
  return prisma.user.create({
    data: {
      email: 'Daniel@gmail.com',
      name: 'lezzgoo',
      password: hashedPwd,
      username: 'danzxc123',
      role: 'Admin',
    },
  })
}

export async function findUser(username: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: {
      username: username,
    },
  })
}

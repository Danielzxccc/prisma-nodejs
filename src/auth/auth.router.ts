import express from 'express'
import bcrypt from 'bcrypt'
import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { createUser, findUser } from './auth.service'
import verifyJwt from '../middleware/verifyJWT'
import { prisma } from '../../db/prisma'

export const authRouter = express.Router()

authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await findUser(username)

    if (!foundUser) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) return res.status(401).json({ message: 'Unauthorized' })

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: foundUser.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: '7d' }
    )

    // Create secure cookie with refresh token
    res.cookie('jwt', refreshToken, {
      httpOnly: true, //accessible only by web server
      // secure: , //https
      sameSite: 'none', //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match
    })

    // Send accessToken containing username and roles
    res.json({ accessToken })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: true, message: error.message })
    }
    res.status(500).json({ error })
  }
})

authRouter.get('/refresh', async (req: Request, res: Response) => {
  try {
    const cookies = req.cookies
    console.log(cookies)

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
      async (err: any, decoded: any) => {
        try {
          if (err) return res.status(403).json({ message: 'Forbidden' })

          const foundUser = await findUser(decoded.username)

          if (!foundUser)
            return res.status(401).json({ message: 'Unauthorized' })

          const accessToken = jwt.sign(
            {
              UserInfo: {
                username: foundUser.username,
                roles: foundUser.role,
              },
            },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: '15m' }
          )

          res.json({ accessToken })
        } catch (error) {
          if (error instanceof Error) {
            return res.status(500).json({ error: true, message: error.message })
          }
          res.status(500).json({ error })
        }
      }
    )
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: true, message: error.message })
    }
    res.status(500).json({ error })
  }
})

authRouter.get('/get', verifyJwt, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findMany()
    res.status(201).json(user)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: true, message: error.message })
    }
    res.status(500).json({ error })
  }
})

authRouter.post('/logout', async (req: Request, res: Response) => {
  try {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none' })
    res.json({ message: 'Cookie cleared' })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: true, message: error.message })
    }
    res.status(500).json({ error })
  }
})

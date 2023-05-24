import express, { Request, Response } from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { prisma } from '../db/prisma'
dotenv.config()

// routes
import { authRouter } from './auth/auth.router'

const PORT: number = 8080

const app = express()
app.use(cors())
app.use(cookieParser())
app.use(express.json())

app.use('/api/auth', authRouter)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { ICustomRequest } from '../../lib/types/Interface'

async function verifyJwt(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || req.headers.Authorization
  if (typeof authHeader === 'string' && !authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const token =
    typeof authHeader === 'string' ? authHeader?.split(' ')[1] : 'token'

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err: any, decoded: any) => {
      if (err) return res.status(403).json({ message: 'Forbidden' })
      //   req.user = decoded.UserInfo.username
      //   req.roles = decoded.UserInfo.roles
      next()
    }
  )
}
export default verifyJwt

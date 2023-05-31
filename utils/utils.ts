import { Response } from "express";


export function handleError(res: Response, error: any){
    if (error instanceof Error) {
        return res.status(500).json({error: true, message: error.message})
      }
      res.status(500).json({ error })
}

import { Router, Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import { IParams, IPostData, TypedRequestBody } from '../types';

const router = Router();
const { post, user } = new PrismaClient();

router.get('/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params as IParams;

  const posts = await post.findMany({
    where: {
      userId: parseInt(userId),
    },
    select: {
      title: true,
      created_at: true,
      post: true,
      user: true,
    },
  });

  return res.send(posts);
});

router.post(
  '/',
  async (
    req: TypedRequestBody<Prisma.PostCreateInput & IPostData>,
    res: Response
  ) => {
    const { content, title, userId } = req.body;

    const userExist = await user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userExist) {
      return res.status(400).json({
        message: 'user not found',
      });
    }

    const newPost = await post.create({
      data: {
        title,
        userId,
        post: content as string,
      },
    });

    return res.json(newPost);
  }
);

export default router;

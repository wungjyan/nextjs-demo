import { NextApiRequest, NextApiResponse } from "next"
import { withIronSessionApiRoute } from "iron-session/next"
import { ironOptions } from "config/index"
import { ISession } from "../index"

import { getDataSource } from "db"
import { User, UserAuth } from "db/entity/index"

import { Cookie } from "next-cookie"
import { setCookie } from "utils/index"

export default withIronSessionApiRoute(login, ironOptions)

async function login(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session
  const { phone = "", verify = "", identity_type = "phone" } = req.body
  console.log("phone=", phone)
  console.log("verify=", verify)

  const cookie = Cookie.fromApiRoute(req, res)

  const AppDataSource = await getDataSource()
  //const userRepo = AppDataSource.getRepository(User)
  const userAuthRepo = AppDataSource.getRepository(UserAuth)

  //console.log(await userRepo.find())

  if (String(session.verifyCode) === String(verify)) {
    // 验证码正确，在user_auths 表中查找 identity_type 是否有记录
    const userAuth = await userAuthRepo.findOne({
      where: {
        identity_type,
        identifier: phone,
      },
      relations: ["user"],
    })
    console.log("userAuth====", userAuth)
    if (userAuth) {
      // 已存在用户
      const user = userAuth.user
      const { id, nickname, avatar } = user

      session.userId = id
      session.nickname = nickname
      session.avatar = avatar

      await session.save()

      setCookie(cookie, { id, nickname, avatar })
      res?.status(200).json({
        code: 0,
        msg: "登录成功",
        data: {
          userId: id,
          nickname,
          avatar,
        },
      })
    } else {
      // 新用户，注册
      const newUser = new User()
      newUser.nickname = `用户_${Math.floor(Math.random() * 10000)}`
      newUser.avatar = "/images/avatar.jpeg"
      newUser.job = "暂无"
      newUser.introduce = "暂无"

      const newUserAuth = new UserAuth()
      newUserAuth.identifier = phone
      newUserAuth.identity_type = identity_type
      newUserAuth.credential = session.verifyCode
      newUserAuth.user = newUser

      const resUserAuth = await userAuthRepo.save(newUserAuth)
      const {
        user: { id, nickname, avatar },
      } = resUserAuth
      session.userId = id
      session.nickname = nickname
      session.avatar = avatar

      await session.save()
      setCookie(cookie, { id, nickname, avatar })
      res?.status(200).json({
        code: 0,
        msg: "登录成功",
        data: {
          userId: id,
          nickname,
          avatar,
        },
      })
    }
  } else {
    res?.status(200).json({ code: -1, msg: "验证码错误" })
  }
}

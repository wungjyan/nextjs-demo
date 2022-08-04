import { NextApiRequest, NextApiResponse } from "next"
import { format } from "date-fns"
import md5 from "md5"
import { encode } from "js-base64"
import request from "service/request"
import { withIronSessionApiRoute } from "iron-session/next"
import { ironOptions } from "config/index"
import { ISession } from "pages/api/index"

export default withIronSessionApiRoute(sendVerifyCode, ironOptions)

async function sendVerifyCode(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session
  const { to = "", templateId = "1" } = req.body
  const AppId = "8aaf0708825efdb2018267b078c7028f"
  const AccountId = "8aaf0708825efdb2018267b077f80288"
  const AuthToken = "db2a79cecf434633870c042260e821b1"
  const NowDate = format(new Date(), "yyyyMMddHHmmss")
  const SigParameter = md5(`${AccountId}${AuthToken}${NowDate}`)
  const Authorization = encode(`${AccountId}:${NowDate}`)
  const verifyCode = Math.floor(Math.random() * 8999) + 1000
  const expireMinute = "5"
  console.log("verifyCode===", verifyCode)

  const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${AccountId}/SMS/TemplateSMS?sig=${SigParameter}`

  const response = await request.post(
    url,
    {
      to,
      templateId,
      appId: AppId,
      datas: [verifyCode, expireMinute],
    },
    {
      headers: {
        Authorization,
      },
    }
  )
  console.log("短信请求结果：", response)
  const { statusCode, statusMsg } = response as any
  if (statusCode === "000000") {
    session.verifyCode = verifyCode
    await session.save()
    res.status(200).json({
      code: 0,
      msg: statusMsg,
    })
  } else {
    res.status(200).json({
      code: statusCode,
      msg: statusMsg,
    })
  }
}

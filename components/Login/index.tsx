import { Button, Input, Row, Col, message } from "antd"
import { useState } from "react"
import CountDown from "components/CountDown"
import request from "service/request"

const Login = () => {
  const [isShowVerifyCode, setIsShowVerifyCode] = useState(false)

  const [form, setForm] = useState({
    phone: "",
    verify: "",
  })

  console.log(setForm)

  const handleCountDownEnd = () => {
    setIsShowVerifyCode(false)
  }
  const handleGetVerifyCode = () => {
    // setIsShowVerifyCode(true)
    if (!form.phone) {
      message.warning("请输入手机号")
      return
    }
    request
      .post("/api/user/sendVerifyCode", { to: form.phone })
      .then((res: any) => {
        console.log("请求结果==", res)
        if (res.code !== 0) {
          message.error(res.msg)
        }
      })
  }

  const handleInputPhone = (e) => {
    const obj = { ...form, phone: e.target.value }
    setForm(obj)
  }

  const handleInputVerifyCode = (e) => {
    const obj = { ...form, verify: e.target.value }
    setForm(obj)
  }
  return (
    <>
      <Input
        value={form.phone}
        onChange={handleInputPhone}
        style={{ marginBottom: "10px" }}
        placeholder="请输入手机号"
      />
      <Row>
        <Col span={18}>
          <Input
            value={form.verify}
            onChange={handleInputVerifyCode}
            placeholder="请输入验证码"
          ></Input>
        </Col>
        <Col span={6}>
          {isShowVerifyCode ? (
            <CountDown time={10} onEnd={handleCountDownEnd} />
          ) : (
            <Button type="link" onClick={handleGetVerifyCode}>
              获取验证码
            </Button>
          )}
        </Col>
      </Row>
      <Button type="primary" block style={{ marginTop: "20px" }}>
        登录
      </Button>
      <Button style={{ padding: 0, marginTop: "10px" }} type="link">
        使用 Github 登录
      </Button>
    </>
  )
}

export default Login

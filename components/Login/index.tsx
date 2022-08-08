import { Button, Input, Row, Col, message } from "antd"
import { useState } from "react"
import CountDown from "components/CountDown"
import request from "service/request"
import { observer } from "mobx-react-lite"
import { useStore } from "store/index"

const Login = (props) => {
  const store = useStore()
  console.log("store===", store)
  const { onClose } = props
  const [isShowVerifyCode, setIsShowVerifyCode] = useState(false)

  const [form, setForm] = useState({
    phone: "",
    verify: "",
  })

  const handleCountDownEnd = () => {
    setIsShowVerifyCode(false)
  }
  const handleGetVerifyCode = () => {
    if (!form.phone) {
      message.warning("请输入手机号")
      return
    }
    setIsShowVerifyCode(true)
    request
      .post("/api/user/sendVerifyCode", { to: form.phone })
      .then((res: any) => {
        console.log("验证码请求结果==", res)
        if (res.code !== 0) {
          message.error(res.msg)
        }
      })
  }

  // 输入手机号
  const handleInputPhone = (e) => {
    const obj = { ...form, phone: e.target.value }
    setForm(obj)
  }

  // 输入验证码
  const handleInputVerifyCode = (e) => {
    const obj = { ...form, verify: e.target.value }
    setForm(obj)
  }

  // 登录
  const handleLogin = async () => {
    if (!form.phone) {
      message.warning("请输入手机号")
      return
    }
    if (!form.verify) {
      message.warning("请输入验证码")
      return
    }
    const loginRes: any = await request.post("/api/user/login", {
      ...form,
      identity_type: "phone",
    })
    console.log("登录结果==", loginRes)
    if (loginRes?.code === 0) {
      // 登录成功
      store.user.setUserInfo(loginRes?.data)
      onClose && onClose()
    } else {
      message.error("登录失败，未知错误")
    }
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
      <Button
        onClick={handleLogin}
        type="primary"
        block
        style={{ marginTop: "20px" }}
      >
        登录
      </Button>
      <Button style={{ padding: 0, marginTop: "10px" }} type="link">
        使用 Github 登录
      </Button>
    </>
  )
}

export default observer(Login)

import type { NextPage } from "next"
import { useState } from "react"
import styles from "./index.module.scss"
import { navs } from "./config"
import Link from "next/link"
import { useRouter } from "next/router"
import { Button, Space, Modal, Dropdown, Menu, Avatar } from "antd"
import { HomeOutlined, LoginOutlined } from "@ant-design/icons"
import Login from "components/Login"
import { observer } from "mobx-react-lite"
import { useStore } from "store/index"
import request from "service/request"

const Navbar: NextPage = () => {
  const store = useStore()
  const { userId, avatar } = store.user.userInfo
  const { pathname } = useRouter()

  const [isShowLogin, setIsShowLogin] = useState(false)

  const handleLoginOpen = () => {
    setIsShowLogin(true)
  }
  const handleLoginClose = () => {
    setIsShowLogin(false)
  }

  function handleLogout() {
    request.post("api/user/logout").then((res: any) => {
      if (res?.code === 0) {
        store.user.setUserInfo({})
      }
    })
  }
  function UserInfoDropMenu() {
    return (
      <Menu>
        <Menu.Item key="1">
          <HomeOutlined />
          &nbsp; 个人主页
        </Menu.Item>
        <Menu.Item key="2" onClick={handleLogout}>
          <LoginOutlined />
          &nbsp; 退出系统
        </Menu.Item>
      </Menu>
    )
  }

  return (
    <div className={styles.navbar}>
      <section className={styles.logoArea}>Blog</section>
      <section className={styles.linkArea}>
        {navs?.map((nav) => (
          <Link key={nav?.name} href={nav?.path}>
            <a className={pathname === nav.path ? styles.active : ""}>
              {nav?.name}
            </a>
          </Link>
        ))}
      </section>
      <section className={styles.operateArea}>
        <Space>
          <Button>写文章</Button>
          {userId ? (
            <Dropdown overlay={UserInfoDropMenu()} placement="bottomLeft">
              <Avatar src={avatar} size={32} />
            </Dropdown>
          ) : (
            <Button type="primary" onClick={handleLoginOpen}>
              登录
            </Button>
          )}
        </Space>
      </section>
      <Modal
        visible={isShowLogin}
        onCancel={handleLoginClose}
        title="手机号登录"
        footer={null}
        closable
        width="400px"
      >
        <Login onClose={handleLoginClose} />
      </Modal>
    </div>
  )
}

export default observer(Navbar)

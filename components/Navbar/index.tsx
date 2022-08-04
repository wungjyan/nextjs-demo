import type { NextPage } from "next"
import { useState } from "react"
import styles from "./index.module.scss"
import { navs } from "./config"
import Link from "next/link"
import { useRouter } from "next/router"
import { Button, Space, Modal } from "antd"

import Login from "components/Login"

const Navbar: NextPage = () => {
  const { pathname } = useRouter()

  const [isShowLogin, setIsShowLogin] = useState(false)

  const handleLoginOpen = () => {
    setIsShowLogin(true)
  }
  const handleLoginClose = () => {
    setIsShowLogin(false)
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
          <Button type="primary" onClick={handleLoginOpen}>
            登录
          </Button>
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
        <Login />
      </Modal>
    </div>
  )
}

export default Navbar

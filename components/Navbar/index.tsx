import type { NextPage } from "next"
import styles from "./index.module.scss"
import { navs } from "./config"
import Link from "next/link"
import { useRouter } from "next/router"

const Navbar: NextPage = () => {
  const { pathname } = useRouter()
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
    </div>
  )
}

export default Navbar

import { Button } from "antd"
import { useState, useEffect } from "react"

interface IProps {
  time: number
  onEnd: Function
}

const CountDown = (props: IProps) => {
  const { time, onEnd } = props
  const [count, setCount] = useState(time || 60)
  useEffect(() => {
    const timer = setInterval(() => {
      if (count === 0) {
        clearInterval(timer)
        onEnd && onEnd()
      } else {
        setCount(count - 1)
      }
    }, 1000)
  }, [count, onEnd])
  return <Button type="link">{count}s</Button>
}

export default CountDown

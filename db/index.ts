import "reflect-metadata"
import { DataSource } from "typeorm"
import { User, UserAuth } from "./entity/index"

const host = process.env.DATABASE_HOST
const port = Number(process.env.DATABASE_PORT)
const username = process.env.DATABASE_USERNAME
const password = process.env.DATABASE_PASSWORD
const database = process.env.DATABASE_NAME

const AppDataSource = new DataSource({
  type: "mysql",
  host,
  port,
  username,
  password,
  database,
  entities: [User, UserAuth],
  synchronize: false,
  logging: true,
})

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err)
  })

export const getDataSource = (delay = 3000): Promise<DataSource> => {
  if (AppDataSource.isInitialized) return Promise.resolve(AppDataSource)

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (AppDataSource.isInitialized) resolve(AppDataSource)
      else reject("Failed to create connection with database")
    }, delay)
  })
}

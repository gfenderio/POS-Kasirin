import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const username = 'admin'
    const password = 'admin'
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.tbl_user.create({
        data: {
            username: username,
            password: hashedPassword,
            fullname: 'Administrator',
            address: '-',
            level: 1,
            foto: '-',
        },
    })

    console.log('Admin user created:', user)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

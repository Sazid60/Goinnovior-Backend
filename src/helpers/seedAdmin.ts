
import * as bcrypt from 'bcryptjs';


import config from '../config';

import prisma from '../shared/prisma';
import { Role } from '@prisma/client';



const seedAdmin = async () => {
    try {
        const isExistSuperAdmin = await prisma.user.findFirst({
            where: {
                role: Role.ADMIN
            }
        });

        if (isExistSuperAdmin) {
            console.log("Admin already exists!")
            return;
        };

        const hashedPassword = await bcrypt.hash(config.admin_password, Number(config.salt_round))

        const superAdminData = await prisma.user.create({
            data: {
                email: config.admin_email,
                password: hashedPassword,
                name: "Admin",
                role: Role.ADMIN,
                admin: {
                    create: {
                        name: "Admin",
                        profilePhoto: "https://res.cloudinary.com/dosvjludu/image/upload/v1759681814/c1309i14mi8-1759681814423-sazid-webp.webp.webp",   
                        contactNumber: "+8801234567890"
                    }
                }
            }
        });

        console.log("Super Admin Created Successfully!", superAdminData);
    }
    catch (err) {
        console.error(err);
    }
    finally {
        await prisma.$disconnect();
    }
};

export default seedAdmin;
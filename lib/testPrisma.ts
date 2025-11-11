import { prisma } from "./prisma";


async function main() {
    const all = await prisma.denuncia.findMany();
    console.log(all);
}

main()
    .catch(console.error)
    .finally(() => process.exit());

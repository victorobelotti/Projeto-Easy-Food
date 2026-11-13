require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.restaurant.count();
  if (count) { console.log('Seed ignorado: banco já possui restaurantes.'); return; }
  await prisma.restaurant.createMany({data: [
    {name:'Pizzaria Napoli', category:'Pizza', rating:4.5},
    {name:'Burger House', category:'Burger', rating:4.2},
    {name:'Sushi Express', category:'Japonesa', rating:4.8}
  ]});
  console.log('Restaurantes iniciais cadastrados.');
}
main().catch(e => {console.error(e);process.exitCode=1}).finally(()=>prisma.$disconnect());

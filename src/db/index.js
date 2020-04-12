import Dexie from 'dexie';
import * as floorData from "../mock/seatData";

console.log(floorData['floor' + 1]);
let floor1Data = []

async function dataInput(num) {
  floorData['floor' + num].desk.forEach((item) => {
    floor1Data.push({
      floor: num,
      desk: item.code,
      seat:item.seat
    })
    // item.seat.forEach((it) => {
    //
    // })
  })
}

for (let i = 0; i < 4; i++) {
  dataInput(i+1)
}
let db = new Dexie('seat');
db.version(1).stores({
  tasks: '++id,seat,floor,desk',
  user:'++id,userName,pass,seat',
  message:'++id,userId,userName,time,content'
})
console.log(db.user);

async function generatedData() {
  await db.tasks.bulkPut([
    ...floor1Data
  ])
}

db.tasks.count((res) => {
  if (res < 1) {
    generatedData()
  }
})
export default db
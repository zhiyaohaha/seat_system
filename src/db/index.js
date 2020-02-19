import Dexie from 'dexie';

var db = new Dexie('seat');
db.version(1).stores({
  tasks: '++id,startTime,endTime,seatCode,desk,floor'
})

function generatedData() {
  db.tasks.put({date: Date.now(), startTime: '110', endTime: '120', seatCode: 104, desk: 1, floor: 1}).then((res) => {
    console.log("Got id " + res);
  })
  // // Now lets add a bunch of tasks
  // await db.tasks.bulkPut([
  //   {date: Date.now(), description: 'Test Dexie bulkPut()', done: 1},
  //   {date: Date.now(), description: 'Finish testing Dexie bulkPut()', done: 1}
  // ]);
}

db.tasks.count((res) => {
  if (res < 1) {
    test()
  }
})

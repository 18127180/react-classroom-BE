const res1 = [{ code: "300" }];
const res2 = [{ id: 10 }, { id: 20 }];
let temp = [];

res1.forEach((student) => {
  res2.forEach((syl) => {
    temp.push(`("${student.code}",${syl.id})`);
  });
});

console.log(temp.join(","));

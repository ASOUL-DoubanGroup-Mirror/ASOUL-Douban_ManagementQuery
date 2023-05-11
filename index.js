const express = require("express");
const app = express();
const port = 3000;
const path = require("path");

const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./ASOUL_DOUBAN_MANAGER_2023-5-2.db");

console.log("Creating data_index into memory......");

db.map("SELECT * FROM 'QueryIndex'", (err, rows) => {
  if (err) {
    console.error(err);
    process.exit(2);
  }

  global.ASOUL_MANAGEDATA_INDEX = rows

  console.log("Has created data_index in memory.");
});

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});
app.use(express.json({ extended: true, limit: "1mb" }));
app.use(express.json())
app.use("/", express.static(path.join(__dirname, "frontend")));

app.get("/Fuzzy/:str", (req, res) => {
  let str = req.params.str;

  let sql = `SELECT * FROM Statistic WHERE author_name like '%${str}%' or ref_storge like '%${str}%' or reply_text like '%${str}%' COLLATE NOCASE`

  db.all(sql,(err,rows)=>{
    if(err){
      console.error(err)
      return
    }
    res.json(rows)
  })
});

app.get("/Exist/:replyid", (req, res) => {
  let reply_id = req.params.replyid;

  res.json(global.ASOUL_MANAGEDATA_INDEX[reply_id])
  
});

app.post("/BatchExist",(req,res)=>{
  let query_queue = req.body.arr
  let response = []
  for(const reply_id of query_queue){
    response.push(`https://www.douban.com/group/topic/${global.ASOUL_MANAGEDATA_INDEX[reply_id].tid}`)   
  }
  res.json(response)
})

/**
 * @Warning 存在sql注入风险
 * @todo 感觉没必要做了。
 * search_item:"uid","id","reply_text"
 * {
 *  search_item:{
 *    fuzzy:"false",
 *    content::"xxxx",
 *    and:"false"
 * },
 * }
 */
app.post("/Precise",(req,res)=>{
  // let query_body = req.body
  // for (const key in query_body) {
  //   let construct_str = `${key} like ${query_body[key].fuzzy?`%${query_body[key].content}%`:`${query_body[key].content}`}`
  // }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

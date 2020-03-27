// */=============================================\* 
//  ||                      .__                  || 
//  ||   ____   ____   ____ |  |   ____   ____   || 
//  || _/ __ \_/ __ \ / ___\|  |  /  _ \ /  _ \  || 
//  || \  ___/\  ___// /_/  >  |_(  <_> |  <_> ) || 
//  ||  \___  >\___  >___  /|____/\____/ \____/  || 
//  ||      \/     \/_____/                  2020|| 
// .\=============================================/.

// npm install express curl cors fs

const port = 42333

const express = require('express')
const app = express()

const cors = require('cors')

const curl = require('curl')
const fs = require('fs') 

// Middleware
app.use(express.static('./public'))

app.use(express.json({limit: '500kb'}));       // SECU
app.use(express.urlencoded({limit: '500kb', extended: true})); // SECU

app.use(cors()) // 4 SAFE SOFT WIN -_- 

// ROOT REDIRECTION
app.get('/', (req,res) => {
  res.redirect(req.baseUrl + '/html.html')
})

//  READ & WRITE DATA TO JSON 
app.get('/ping', (req,res) => {
  
  console.log("ASK ?")
  const date = new Date()
  
  // IP PROVENANCE
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  // lecture data
  fs.readFile('./json.json', 'utf-8', (err, json) => { 
    if (err) throw err // CONTROLE

      // fusion dans un buffer
      let bufferJson = JSON.parse(json).localData // deconstruction json
      bufferJson.push({ date : date , ip : ip.replace("::ffff:","") , num : bufferJson.length + 1 }) // add data
      const newJsonData = { localData : bufferJson } // reconstruction json

      // ecriture data
      fs.writeFile('./json.json', JSON.stringify(newJsonData) , 
        (err, jsonDataUp) => {
          if (err) res.send("NOK") // CONTROLE

          console.log("OK")
          console.log(" ")
          res.send(JSON.stringify(newJsonData)) // RENVOIE LE JSON
        })
    }) 
})

app.listen(port, () =>  { 
  curl.get('http://roiseux.fr', // Recup publique ip
    (err, response, body) => { 
      if (err) throw err // CONTROLE

      console.log("Serveur Listening...") // INFORMATION 
      console.log(`Access via : http://localhost:${port}/`) // INFORMATION 
      console.log(`ip public :${body}\nport : ${port}`) // INFORMATION

    }
  )
})

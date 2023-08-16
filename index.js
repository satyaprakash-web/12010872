const express = require('express');
const axios = require('axios');

const app = express();


app.use("/api/numbers", async (req, res)=>{
    if(!req.query.url){
        return res.json({
            message: "no url present",
        })
    }
    let urls = [];
    if(!Array.isArray(req.query?.url)){
        urls.push(req.query.url);
    } else {
        urls = req.query.url;
    }
    // Validate all urls

    const re=/^https?\:\/\/[^\/\s]+(\/.*)?$/
    const promises = []
    urls.map(async (url)=>{
        console.log(url+" => "+re.test(url))
        if(re.test(url)){
            const promise = axios.get(url);
            promises.push(promise);
        }
    });

    Promise.all(promises).then((response)=>{
        const numArr = [];
        response.forEach(val =>{
            numArr.push(...val.data.numbers)
        });
    
        const set = new Set(numArr);
        let sortedAr = Array.from(set)
        console.log(sortedAr)
        sortedAr = sortedAr.sort((a, b)=> a-b)

        console.log(sortedAr)

        return res.json({
            numbers: sortedAr
        })
    })
})

app.listen(8080, ()=>{
    console.log("API running on port 8080")
})
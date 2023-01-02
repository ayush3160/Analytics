//Import dependencies
const express = require('express');
const Moment = require('moment');

//Import models
const Track = require('../models/trackDetails');
const Sites = require('../models/sitesDetails');
const Customer = require('../models/customerDetails');

//create router
const router = express.Router();

//routing
router.get("/", async(req, res) => {
    //get all the data
    const allTracks = await Track.find();

    //respond
    res.json({data: allTracks});
});

//create data before page exist or go to another page
router.post("/create", async(req, res) => {
    //check the data
    if (typeof req.body === "string")
    {
        req.body = JSON.parse(req.body);
    }
    // console.log(req.body);

   //request url
    const siteUrl = req.protocol + '://' + req.headers.host;
    // console.log(siteUrl);
    const siteURL = req.header("Origin");
    // console.log(siteURL);
    //check site matches from the server

    Sites.findOne({siteUrl: siteURL}, function(err, docs){
        
        if(docs == null){
            // console.log(docs);
            // console.log("sorry! no site found");
            res.json({data:"Sorry! No site found", status: 404});
            
        }else{
            //get all the data
            const {
                page_url, 
                page_name, 
                total_time_stayed, 
                location, 
                timezone, 
                lat,
                longi, 
                uuid, 
                device_type,
                browser_name,
                date_created
            } = req.body;
            
            //create data
            Track.create({
                page_url, 
                page_name, 
                total_time_stayed, 
                location,  
                timezone, 
                lat,
                longi, 
                uuid, 
                device_type,
                browser_name,
                date_created
            }); 
            // console.log("site found");

            //respond
            res.sendStatus(202); 
        }
        return true;
    });

    //check https
    /* if(req.protocol == "https"){
    }else{
        res.json({data:'Sorry! please update your SSL',status:502})
    } */
    
});

//create data when button is clicked
router.post("/createBtn", async(req, res) => {
    
    if (typeof req.body === "string")
    {
        req.body = JSON.parse(req.body);
    }
    // console.log(req.body);
    //request url
    const siteUrl = req.protocol + '://' + req.headers.host;
    // console.log(siteUrl);
    const siteURL = req.header("Origin");
    // console.log(siteURL);
    Sites.findOne({siteUrl: siteURL}, function(err, docs){
        // console.log(docs);
        if(docs == null){
            // console.log(docs);
            res.json({data:"Sorry! No site found", status: 404});
            // console.log("sorry! no site found");
            
        }else{
            // console.log("site found");
            //create data
            Track.create(req.body);  
            
            //respond
            res.sendStatus(202); 
        }
        return true;
    });
    
    //create data
   

    //respond
   // res.json({data: req.body});
    //res.sendStatus(204);
});

//find data by button true
router.get("/userClickedBtn", (req, res) => {
     Track.find({button_clicked:{$exists: true}}, function(err, tracks) {
        if(err){
            // console.log(err);
            res.send(err);
        }else{
            // console.log(tracks);
            res.send(tracks);
        }
    });
})


 
//for fontend
router.get("/sessionData", async(req, res)=>{
    
    let startDay = Moment().subtract(6,'days').format("YYYY-MM-DD");
    let endDay = Moment().format("YYYY-MM-DD");


   
        let sessionData = await Track.aggregate([
            {
                $match: {
                    date_created: 
                        {$gt:new Date(startDay),$lte:new Date(endDay)}
                    
                }
            },
                {
                $group:{
                    _id: '$date_created',
                    count:{$sum: 1}
                }
            }

        ]);
       //top 4 sessions
        let topSessions = await Track.aggregate([
           
            {
                $group:{
                    _id: '$page_name',
                    count:{$sum: 1}
                }
            }
            ,{$limit: 6}
        ]);
        //browser session 
        let getBrowser = await Track.aggregate([
            {
                $group:{
                    _id: '$browser_name',
                    count:{$sum: 1}
                }
            }
        ]);

        let totalCount = getBrowser.reduce((accum, item) => accum + item.count, 0);

        let browserPercentage = [0,0,0,0,0,0,0];
        

        Object.keys(getBrowser).forEach(key =>{
                       
            if(getBrowser[key]._id == 'MS Edge'){
                browserPercentage[4] = Math.round((getBrowser[key].count / totalCount)* 100);
            }

            if(getBrowser[key]._id == 'Chrome'){
                browserPercentage[0] = Math.round((getBrowser[key].count / totalCount)* 100);
            }

            if(getBrowser[key]._id == 'Mozilla Firefox'){
                browserPercentage[1] = Math.round((getBrowser[key].count / totalCount)* 100);
            }
        
            if(getBrowser[key]._id == 'Safari'){
                browserPercentage[2] = Math.round((getBrowser[key].count / totalCount)* 100);
            }

            if(getBrowser[key]._id == 'Opera'){
                browserPercentage[3] = Math.round((getBrowser[key].count / totalCount)* 100);
            }

            if(getBrowser[key]._id == 'MS IE'){
                browserPercentage[5] = Math.round((getBrowser[key].count / totalCount)* 100);
            }

            if(getBrowser[key]._id == 'other'){
                browserPercentage[6] = Math.round((getBrowser[key].count / totalCount)* 100);
            }
        
        })        

       
       
        /* sessionData.forEach(element => {
            
             let sessionResult = Moment(element._id) == ('2022-12-07');
             console.log(sessionResult);
        }); */
        let result = {};
        while(startDay<=endDay){
            // console.log(startDay,endDay);
            let count = sessionData.find((data) => Moment(data._id).format("YYYY-MM-DD") === startDay);
            // console.log(count);
            result[startDay] = count ? count.count : 0;
            startDay = Moment(startDay,"YYYY-MM-DD").add(1,'days').format("YYYY-MM-DD");
        }
        // console.log(result);
        // console.log(topSessions);
        // console.log(getBrowser);
        
        res.send({'browserPercentage':browserPercentage, 'topSession': topSessions, 'dateWiseResult': result});

  });

//customer details
router.get("/customers", async(req, res)=>{
    const customer = await Customer.aggregate([
        {
            $lookup:{
                from: "sitedetails",
                localField: "site_id",
                foreignField: "siteId",
                as: "sites"
            }
          }
    ]);
    res.send(customer);
})

router.get("/customer_session", async(req, res)=>{
    const customer = await Customer.aggregate([
        {
            $lookup:{
                from: "tracks",
                localField: "uuid",
                foreignField: "uuid",
                as: "track"
            }
          }
    ]);
    res.send(customer);
})



module.exports = router;
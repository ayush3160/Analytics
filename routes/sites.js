//Import dependencies
const express = require('express');

//Import models
const Sites = require('../models/sitesDetails');
const Counter = require('../models/siteCountDetails');

//create router
const router = express.Router();

//routing
router.post("/create", async(req, res) => {
   
  //site id
  let siteId;
  //get the data
  const siteUrl = req.body.siteUrl;
  const name = req.body.name;

  const sites = await Sites.exists({'siteUrl': siteUrl});

  if(sites == null){
    // console.log("empty"+sites);
      //counter part
      Counter.findOneAndUpdate(
        {id: "autoval"},
        {"$inc":{"seq":1}},
        {new:true}, (err, cd) => {
        
        if(cd == null){
            const newVal = new Counter({id:"autoval",seq:1});
            newVal.save();
            siteId = 1;
            //create the site details
            createSite()
        }else{
            siteId = cd.seq;
            //respond 
            createSite()
        }    
      }); 
  }else{
    res.sendStatus(208);
  }
  //function to create site
  const createSite = () => {
    const cs = new Sites({
     siteUrl: siteUrl,
     name: name,
     siteId: siteId
   });
   cs.save(function(err) {
    if(err){
      // console.log('Sites already exists');
      res.json({data:'Sites already exists', status: 208});
    }else{
      // console.log('successfully saved');
      res.json({data:'successfully saved', status: 200});
    }
   })
  };



});

router.get("/", async (req, res) => {
    //find all sites
    const sites = await Sites.find();
    res.json(sites);
});

router.get("/:id", async(req, res) => {
    //get the id
    const siteId = req.params.id;

    //find the site 
    const site = await Sites.findById(siteId);

    //respond
    res.json({site: site})
})

//update the site details
router.put('/update/:id', async (req, res) => {
    //get the id 
    const siteId = req.params.id;
    // console.log(siteId);
    
    //update the record
    await Sites.findByIdAndUpdate({ _id: siteId }, { $set: req.body });
    //find updated one
    const site = await Sites.findById(siteId)
    //respond
    res.json({site: site});
});

//delete site
router.delete("/delete/:id", async(req, res) => {
    //get id from url
    const siteID = req.params.id;
    //delete the record
    await Sites.deleteOne({id: siteID});

    //respond 
    res.json({data: "successfully deleted"});
});

module.exports = router;

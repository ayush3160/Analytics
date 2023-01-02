//Import dependencies
const express = require('express');

//Import models
const Sites = require('../models/sitesDetails');
const Customer = require('../models/customerDetails');

//create router
const router = express.Router();

//routing
router.post("/create", async(req, res) => {
   
    if (typeof req.body === "string")
    {
        req.body = JSON.parse(req.body);
    }
    // console.log(req.body);
  //get the data
  const cust_name = req.body.cust_name;
  const wa_number = req.body.wa_number;
  const siteUrl   = req.body.siteUrl;
  const uuid      = req.body.uuid;
    
//   console.log(siteUrl);
  
 /*  const sites = await Sites.aggregate([
    {
    $lookup:{
        from: "customerdetails",
        localField: "siteId",
        foreignField: "site_id",
        as: "customerRecord"
    }
  }
 ]);

//   console.log(sites);
  res.send(sites); */


  //check site
  const sites = await Sites.find({'siteUrl': siteUrl});
//   console.log(sites);
  if( sites != null){

      //check customer 
      const customerExist = await Customer.find({'uuid': uuid, 'site_id': sites[0].siteId});
    //   console.log(customerExist);
      if(customerExist.length === 0){
         //create the customer details
        const cc = new Customer({
            cust_name : cust_name,
            wa_number : wa_number,
            site_id   : sites[0].siteId,
            uuid      : uuid
        }); 
        cc.save(function(err) {
            // if (err) return console.log("error"+err);;
            // console.log('record ');
            res.send({status: 200}) 
        }); 
       } else{
        res.sendStatus(208);
       }  
  }else{
    res.send("no site found")
  }

 

 
  
});

router.get("/", async (req, res) => {
    //find all customers
    const customer = await Customer.find();
    res.json(customer);
});

router.get("/:id", async(req, res) => {
    //get the id
    const custId = req.params.id;

    //find the customer 
    const customer = await Customer.findById(custId);

    //respond
    res.json({customer : customer})
})

//update the customer details
router.put('/update/:id', async (req, res) => {
    //get the id 
    const custId = req.params.id;
    
    //update the record
    await Customer.findByIdAndUpdate({ _id: custId }, { $set: req.body });
    //find updated one
    const customer = await Customer.findById(custId)
    //respond
    res.json({customer: customer});
});

//delete customers
router.delete("/delete/:id", async(req, res) => {
    //get id from url
    const custId = req.params.id;
    //delete the record
    await Customer.deleteOne({id: custId});

    //respond 
    res.json({data: "successfully deleted"});
});

module.exports = router;

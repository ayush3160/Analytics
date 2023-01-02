let dataSet = [];
window.onload = apicalls()
async function apicalls() {
fetch('http://3.109.28.80:3007/track/customers')
      .then((response) => response.json())
      .then((data) => 
      { 
        console.log(data);
        Object.keys(data).forEach(ele =>{
            let arr1 = []
            const siteDetails = data[ele].sites;

            const date = new Date(data[ele].createdAt);
            
            arr1.push(data[ele].cust_name);
            arr1.push(data[ele].wa_number);
           arr1.push(siteDetails[0].name);
            arr1.push(date.toISOString().substring(0, 10));
            console.log(siteDetails[0].name);
            dataSet.push(arr1); 
        })
        console.log(dataSet);
        buildTable(dataSet);
      }).catch((err) => {
        console.log("Error in customer data fetch",err);
        dataSet.length=0;
      });
}


const buildTable = (dataSet) => {
    $("#products-datatable").dataTable({
        data: dataSet,
        pageLength: 10,
        /* columns: [ {
                orderable: !1,
                render: function(e, l, a, o) {
                    return "display" === l && (e = '<div class="form-check"><input type="checkbox" class="form-check-input dt-checkboxes"><label class="form-check-label">&nbsp;</label></div>'), 
                    e;
                },
                checkboxes: {
                    selectRow: !0,
                    selectAllRender: '<div class="form-check"><input type="checkbox" class="form-check-input dt-checkboxes"><label class="form-check-label">&nbsp;</label></div>'
                }
            },  {
                orderable: !0
            }, {
                orderable: !0
            }, {
                orderable: !0
            }, {
                orderable: !0
            }, {
                orderable: !0
            }, {
                orderable: !0
            }, {
                orderable: !1
            } ],*/
        select: {
            style: "multi"
        }
    });
}

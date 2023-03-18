const express = require("express");
const app = express();
const cors = require('cors');
const port = 8080;
var fs = require('fs');
app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.get("/", (req, res) => {
    fs.readFile('./ex.json' , 'utf8',(err , data) => {
        if(err){
            console.log("check error" , err)
        }
        const mainData = JSON.parse(data)
        
        const nested = []

        function checkDataHave(data , mathedKey){
            var haveData = data.find(item => item.key === mathedKey)
            if(haveData){
                return true
            }else{
                return false
            }
        }

        function findIndexOfvalue(data , matchVal){
            // console.log("check the data index" , data , matchVal)
            var index = data.findIndex(function(obj) {
                return obj.key == matchVal;
            });

            return index
        }

        function pushData(data , fileSize){
            if(nested.length === 0){
                nested.push({
                    key : data[0],
                    value : []
                })
            }
            let checkData = nested?.find(item => item.key === data[0])
            if(checkData){
                if(nested[0].value.length > 0){
                    if(checkDataHave(nested[0].value, data[1])){
                       var getIndex =  findIndexOfvalue(nested[0].value, data[1])
                       if(nested[0].value[getIndex].timeordata.length == 0){
                        nested[0].value[getIndex].timeordata.push({
                            key : data[2],
                            datetime : []
                        })
                       }else{
                        var getIndex =  findIndexOfvalue(nested[0].value, data[1])
                        if(checkDataHave(nested[0].value[getIndex].timeordata, data[2])){
                            // push Date
                            var getIndexFile =  findIndexOfvalue(nested[0].value[getIndex].timeordata, data[2])
                            if(nested[0].value[getIndex].key == data[1]){
                                nested[0].value[getIndex].timeordata[getIndexFile].datetime.push({
                                    key : data[3],
                                    fileSize :fileSize
                                })
                            }
                        }else{
                            nested[0].value[getIndex].timeordata.push({
                                key : data[2],
                                datetime : []
                            })
                        }
                       }
                    }else{
                        nested[0].value.push({
                            key : data[1],
                            timeordata : []
                        })
                    }
                }else{
                    nested[0].value.push({
                        key : data[1],
                        timeordata : []
                    })
                }
                }
        }
        for (let i = 0; i < mainData.length; i++) {
            // console.log("check the mainData" , mainData[i].path.split("/"))
            pushData(mainData[i].path.split("/") , mainData[i].size)
        }
        res.json({
            success : true,
            msg : "Data found.",
            data : nested
        });
    })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
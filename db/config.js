const mongoose = require("mongoose");



const dbConection=async()=>{
    try{
        await mongoose.connect(process.env.DB_CNN,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log('DB online');
    }catch(error){
        console.log(error);
        throw new Error('Error a la hora de inicializar la BBDD');
    }
}


module.exports= {
    dbConection
}
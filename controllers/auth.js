const {response}=require('express');
const bcrypt=require('bcryptjs');
const Usuario=require('../models/Usuario');
const {generarJWT}=require('../helpers/jwt');


const crearUsuario =async(req,res=response)=>{

    
    const{email,name,password}= req.body;
    // console.log(email,name,password);

    try {
       
    //verificamos que no exista un correo igual

        let usuario = await Usuario.findOne({email:email});

        if(!usuario){

            //Crear usuario con el modelo
            const dbUser = new Usuario(req.body);

            //Encriptar contraseña
            const salt = bcrypt.genSaltSync();
            dbUser.password= bcrypt.hashSync(password, salt);

        
            //Generar JWT para enviar a angular
        
            const token = await generarJWT(dbUser.id,dbUser.name);

            //Generar Usuario en BBDD
                await dbUser.save();
        
            //Generar respuesta exitosa 
            return res.status(201).json({
                ok:true,
                uid:dbUser.id,
                name,
                token
            });
        }else{
            return res.status(400).json({
                ok:false,
                msg: 'El usuario ya existe'
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg: 'Por favor hable con el admin de la BBDD'
        });
    }



    
}

const loginUsuario=async(req,res)=>{
    const{email,password}= req.body;
    // console.log(email,password);

    try {
       
        const dbUser =await Usuario.findOne({email});
        if(dbUser){
            //Confirmamos si el password hace match
            const validPassword = bcrypt.compareSync( password, dbUser.password );
            if(validPassword){

                const token = await generarJWT(dbUser.id,dbUser.name);
                //respuesta del servicio
                return res.json({
                    ok:true,
                uid:dbUser.id,
                name:dbUser.name,
                token
                });

            }else{
                return res.status(400).json({
                    ok:false,
                    msg: 'El password no existe'
                });
            }
        }else{
            return res.status(400).json({
                ok:false,
                msg: 'El correo no es válido'
            });
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg: 'Hable con el ADMIN'
        });
    }   
}

const revalidarToken = async(req,res)=>{

    const {uid,name}= req;
    const token = await generarJWT(uid,name);


    return res.json({
        ok:true,
        uid,
        name,
        token
    });

}


module.exports={
    crearUsuario,
    revalidarToken,
    loginUsuario
}
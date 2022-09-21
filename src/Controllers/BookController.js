const bookModel= require("../Models/BooksModel")
const UserModel = require("../Models/UserModel")
const validator = require('validator')
const moment = require('moment')

let createBook= async function(req,res){
    
    try{
        let data= req.body

        if(!data.userId)return res.status(400).send({status:false,msg:"userId is mandatory "})
        const validUser= await UserModel.findById(data.userId)
        if(!validUser) return res.status(400).send({status:false,msg:"user not found"})
        const validBook= await bookModel.find({title:data.title,ISBN:data.ISBN})
        if(!validBook) return res.status(400).send({status:false,msg:"title and ISBN must be Unique"})
        if(!data.ISBN) return res.status(400).send({status:false,msg:"ISBN is mandatory"})
       if(!validator.isISBN([data.ISBN,13].toString())) return res.status(400).send({status:false,msg:"ISBN is not in prporway"})
        let savedUser= await bookModel.create(data)

        return res.status(201).send({status:true,msg:"book created successfully",data:savedUser})

    }catch(error){
        return res.status(500).send(error.message)
    }
}
















module.exports.createBook= createBook
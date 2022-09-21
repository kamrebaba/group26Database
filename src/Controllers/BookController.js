const bookModel= require("../Models/BooksModel")
const UserModel = require("../Models/UserModel")
const moment = require('moment')
const mongoose=require ('mongoose')
const {body,isValidObjectId,isValidISBN, validation} = require("../middleware/validation");
const BooksModel = require("../Models/BooksModel");



let createBook= async function(req,res){
    
    try{
        let data= req.body
        if(!body(data)) return res.status(400).send({status:false,msg:"Input is Missing "})
        
        if(!validation(data.userId))return res.status(400).send({status:false,msg:"userId is mandatory "})
        const validUser= await UserModel.findById(data.userId)
        if(!validUser) return res.status(400).send({status:false,msg:"user not found"})
        const validBook= await bookModel.find({title:data.title,ISBN:data.ISBN})
        if(!validBook) return res.status(400).send({status:false,msg:"title and ISBN must be Unique"})
        if(!validation(data.title)) return res.status(400).send({status:false,msg:"title is mandatory"})

        if(!validation(data.ISBN)) return res.status(400).send({status:false,msg:"ISBN is mandatory"})
       if(!isValidISBN(data.ISBN)) return res.status(400).send({status:false,msg:"ISBN should be of 13 digits"})
        if(!validation(data.excerpt))  return res.status(400).send({status:false,msg:"excerpt is required"})
        if(!validation(data.category))  return res.status(400).send({status:false,msg:"category is required"})
        if(!validation(data.subcategory))  return res.status(400).send({status:false,msg:"subcategory is required"})

        let savedUser= await bookModel.create(data)

        return res.status(201).send({status:true,msg:"book created successfully",data:savedUser})

    }catch(error){
        return res.status(500).send(error.message)
    }
}



const getBookById= async function(req, res){
    try{
         let bookId=req.params.bookId
 if(!bookId) return res.status(400).send({status:false, msg: "BookId is required"})
 if(!isValidObjectId(bookId))
 return res.status(400).send({status:false, msg: "BookId is notValid"})
let getData = await bookModel.findById({_id:bookId, isDeleted:false})
if (!getData) return res.status(404).send({status:false, msg: "Data not found"})

 return res.status(200).send({status:true, msg:"Data found", data:getData})

    }catch(error){
        return res.status(500).send(error.message)
    }
}

const getBooks=async (req,res)=>{
try {
    let queryData=req.params
queryData.isDeleted=false
if(!queryData) return res.status(400).send({status:false,msg:"Query should not be empty"})

const FindBooks=await BooksModel.find({isDeleted:false}).sort({title:1}).select({ISBN:0,subcategory:0})
res.status(200).send({status:true,msg:"Books List",data:FindBooks})
} catch (error) {
    return res.status(500).send(error.message)
    
}

}


module.exports.createBook= createBook
module.exports.getBookById=getBookById
module.exports.getBooks= getBooks

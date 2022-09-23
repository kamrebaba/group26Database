const bookModel= require("../Models/BooksModel")
const {body,isValidObjectId,isValidISBN, validation,isValidname} = require("../middleware/validation");
const reviewModel= require("../Models/ReviewModel");
const BooksModel = require("../Models/BooksModel");
const validator=require('validator')


let Postreviews = async (req,res)=>{

try {
    let bookId = req.params.bookId
  if(!bookId) return res.status(400).send({status:false,msg:"Book id should be in params"})
  let CheckBook= await BooksModel.findById(bookId)
  if(CheckBook.isDeleted==true) return res.status(400).send({status:false,msg:"no book found"})

  let data=req.body
  if(body(!data)) return res.status(400).send({status:false,msg:"Input is missing"})

  if(!isValidname(data.reviewedBy)) return res.status(400).send({status:false,msg:"name is mandatory"})
  if(!validator.isDate(data.reviewedAt)) return res.status(400).send({status:false,msg:"date is mandatory"})
  if(!data.rating ) return res.status(400).send({status:false,msg:"rating is mandatory"})
  if((!(data.rating<6) && (data.rating>0))) return res.status(400).send({status:false,msg:"rating should be between 1 to 5"})

   data.bookId=bookId

 let reviewData=await reviewModel.create(data)
  await BooksModel.updateOne({_id:bookId},{$inc:{reviews:1}})
  return res.status(201).send({status:true,msg:"Review Created successfully",data:reviewData})    

} catch (error) {
    return res.status(500).send({msg:error.message})
    
}

}

module.exports.Postreviews=Postreviews
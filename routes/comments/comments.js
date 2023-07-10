const express = require("express")
const { createCommentCtrl, updateCommentCtrl, deleteCommentCtrl, CommentDetailsCtrl } = require("../../controllers/comments/comments")
const protected = require("../../middlewares/protected")
const commentRoutes = express.Router()

commentRoutes.post("/:id",protected, createCommentCtrl)
//GET/api/vi/comments/:id
commentRoutes.get("/:id", CommentDetailsCtrl)
//PUT/api/vi/comments/:id
commentRoutes.put("/:id", protected, updateCommentCtrl)
//DELETE/api/vi/comments/:id
commentRoutes.delete("/:id",protected, deleteCommentCtrl)

module.exports = commentRoutes
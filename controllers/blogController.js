const User = require("../models/userModel");
const Blog = require("../models/blogModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");
const slugify = require("slugify");

/**
 * @desc    Create a blog
 * @method  POST
 * @route   /blog/
 * @access  private
 */
const createBlog = asyncHandler(async (req, res) => {
  try {
    const createdBlog = new Blog(req.body);
    const savedBlog = await createdBlog.save();
    // const { __v, ...others } = savedBlog;
    res.status(201).json({
      data: [savedBlog],
      msg: "blog has been created successfully",
      Status: "Created",
    });
  } catch (err) {
    throw new Error(err);
  }
});

/**
 * @desc    Update a blog
 * @method  PUT
 * @route   /blog/:id
 * @access  private
 */
const updateBlog = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res
      .status(202)
      .json({ data: [updatedBlog], msg: "updated blog done", Success: true });
  } catch (err) {
    throw new Error(err);
  }
});

/**
 * @desc    Get a blog
 * @method  GET
 * @route   /blog/:id
 * @access  private
 */
const getBlog = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const blog = await Blog.findById(id).populate(["likes", "disLikes"]);
    let views = blog._doc.numViews;
    await Blog.findByIdAndUpdate(id, { $inc: { numViews: 1 } });
    res
      .status(200)
      .json({ data: [blog], msg: "blog geted successfully", Success: true });
  } catch (err) {
    throw new Error(err);
  }
});
/**
 * @desc    Get All blog
 * @method  GET
 * @route   /blog/
 * @access  private
 */
const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find().populate(["likes", "disLikes"]);
    res.status(200).json({
      data: blogs,
      msg: "blogs geted successfully",
      Success: true,
    });
  } catch (err) {
    throw new Error(err);
  }
});
/**
 * @desc Delete a Bog
 * @method delete
 * @route /blog/:id
 * @access private
 */
const deleteBlog = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    await Blog.findByIdAndDelete(id);
    res.status(200).json({ msg: "the blog has been deleted", Success: true });
  } catch (err) {
    throw new Error(err);
  }
});
/**
 * @desc like a blog
 * @method PUT
 * @route /blog/like
 *@access private
 */
const likeTheBlog = asyncHandler(async (req, res) => {
  try {
    const blogId = req?.body?.blogId;
    validateMongoDbId(blogId);
    // find the blog which we want to like
    const blog = await Blog?.findById(blogId);
    //find login user
    const loginUserId = req?.user?._id;
    // find if the user has liked the blog
    const isLiked = blog?.isLiked;
    const alreadyDisliked = blog?.dislikes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );
    let resBlog;
    if (alreadyDisliked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      );
      res.status(202).json({
        msg: "you removed dislike",
        Success: true,
      });
    }
    if (isLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      res.status(202).json({
        msg: "you removed like",
        Success: true,
      });
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: loginUserId },
          isLiked: true,
        },
        { new: true }
      );
      res.status(202).json({
        msg: "you  liked",
        Success: true,
      });
    }
  } catch (err) {
    throw new Error(err);
  }
});
/**
 * @desc dislike a blog
 * @method PUT
 * @route /blog/dislike
 * @access private
 */
const disLikeTheBlog = asyncHandler(async (req, res) => {
  try {
    const blogId = req?.body?.blogId;
    validateMongoDbId(blogId);
    // find the blog which we want to like
    const blog = await Blog?.findById(blogId);
    //find login user
    const loginUserId = req?.user?._id;
    // find if the user has liked the blog
    const isDisliked = blog?.isDisliked;
    const alreadyliked = blog?.likes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );

    if (alreadyliked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      );
      res.status(202).json({
        msg: "you removed like",
        Success: true,
      });
    }
    if (isDisliked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          disLikes: false,
        },
        { new: true }
      );
      res.status(202).json({
        msg: "you removed dislike",
        Success: true,
      });
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { disLikes: loginUserId },
          isDisliked: true,
        },
        { new: true }
      );
      res.status(202).json({
        msg: "you  disliked",
        Success: true,
      });
    }
  } catch (err) {
    throw new Error(err);
  }
});
// local module exporting
module.exports = {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  likeTheBlog,
  disLikeTheBlog,
};

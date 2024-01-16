const router = require("express").Router();
const { ErrorMessage, SuccessMessage } = require("../utils/handler");
const User = require("../models/User");
const { Op } = require("sequelize");
const sequelize = require("../utils/DBConnection");
const Discussion = require("../models/Discussion");
const Comment = require("../models/comment");

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Comment.findAll({
      where: {
        DiscussionId: Number(id),
      },
      order: [["createdAt"]],
      include: {
        model: User,
        attributes: {
          exclude: "password",
        },
      },
    });

    return SuccessMessage(data, res);
  } catch (err) {
    return ErrorMessage(err, res);
  }
});

// /create

router.post("/", async (req, res) => {
  try {
    const { DiscussionId, CommentId, content } = req.body;

    console.log(req.body);

    const UserId = res.locals.data.id;

    const newComment = await Comment.create({
      UserId: Number(UserId),
      DiscussionId: Number(DiscussionId),
      CommentId: CommentId ? Number(CommentId) : null,
      content,
    });

    await newComment.save();

    return SuccessMessage({}, res);
  } catch (err) {
    console.log(err);
    return ErrorMessage(err, res);
  }
});

// /delete
// allow all moderator to delete , but allow creater to delete only their comment

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findOne({
      where: {
        id: Number(id),
      },
    });

    if (!comment) return ErrorMessage("No Such Comment Exists", res);

    const requestedUser = res.locals.data.id;

    const createdUser = comment.getDataValue("UserId"),
      isModerator = res.locals.data.isModerator;

    console.log(createdUser, isModerator, requestedUser);

    if (requestedUser === createdUser || isModerator) {
      await comment.destroy({
        where: {
          id: Number(id),
        },
      });

      return SuccessMessage(
        { message: "Delete Successfully", status: "Success" },
        res
      );
    }

    return SuccessMessage(
      {
        message: "You are not Moderator or creator of this comment",
        status: "Failure",
      },
      res
    );
  } catch (err) {
    return ErrorMessage(err, res);
  }
});

module.exports = router;

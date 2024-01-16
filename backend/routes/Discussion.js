const router = require("express").Router();
const { ErrorMessage, SuccessMessage } = require("../utils/handler");
const User = require("../models/User");
const { Op, literal } = require("sequelize");
const sequelize = require("../utils/DBConnection");
const Discussion = require("../models/Discussion");
const Comment = require("../models/comment");

// get all  discussion
router.get("/:page/:pageSize", async (req, res) => {
  try {
    const { page, pageSize } = req.params;
    let data = await Discussion.findAll({
      attributes: {
        include: [
          [
            literal(
              '(SELECT COUNT(*) FROM "Comment" WHERE "Comment"."DiscussionId" = "Discussion"."id")'
            ),
            "comments",
          ],
        ],
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password"],
          },
        },
      ],
      order: [["createdAt", "DESC"]],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    return SuccessMessage(data, res);
  } catch (err) {
    return ErrorMessage(err, res);
  }
});

// /create

router.post("/", async (req, res) => {
  try {
    const { topic, content } = req.body;

    console.log(res.locals.data);

    const UserId = res.locals.data.id;

    const newDiscussion = await Discussion.create({
      UserId,
      topic,
      content,
    });

    await newDiscussion.save();

    return SuccessMessage({}, res);
  } catch (err) {
    return ErrorMessage(err, res);
  }
});

//fetch one
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id);

    let data = await Discussion.findOne({
      where: {
        id: Number(id),
      },
      include: {
        model: User,
        attributes: {
          exclude: "password",
        },
      },
    });

    if (data === null) return ErrorMessage({}, res);

    data = data.dataValues;

    return SuccessMessage(data, res);
  } catch (err) {
    console.log(err);
    return ErrorMessage(err, res);
  }
});

//like/dislike one
// router.post("/:op/:id/", async (req, res) => {
//   try {
//     const { id, op } = req.params;

//     if (op === "like") {
//       await Discussion.increment( ["likes"], { by: 1 ,where : {id} });
//     } else {
//       await Discussion.decrement(["likes"], { by: 1 ,where : {id} });
//     }

//     return SuccessMessage({}, res);
//   } catch (err) {
//     return ErrorMessage(err, res);
//   }
// });

// /delete
// allow all moderator to delete , but allow creater to delete only their post
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const discussion = await Discussion.findOne({
      where: {
        id: Number(id),
      },
    });

    if (!discussion)
      return ErrorMessage(
        { message: "No Such Discussion Exists", status: "Failure" },
        res
      );

    const requestedUser = res.locals.data.id;

    const createdUser = discussion.getDataValue("UserId"),
      isModerator = res.locals.data.isModerator;

    console.log(createdUser, isModerator, requestedUser);

    if (requestedUser === createdUser || isModerator) {
      await Discussion.destroy({
        where: {
          id: Number(id),
        },
      });

      return SuccessMessage(
        { message: "Successfully Deleted", status: "Success" },
        res
      );
    }

    return SuccessMessage(
      {
        message: "You are not Moderator or creator of this Discussion",
        status: "Failure",
      },
      res
    );
  } catch (err) {
    return ErrorMessage(err, res);
  }
});

module.exports = router;

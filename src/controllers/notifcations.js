
const Users = require("../models/users/users")
const Notifications = require("../models/notifications.js")


var controller = {};



controller.getNotifcations = async (req, res) => {

    const id = req.userId;

    const page = Number.parseInt(req.query.page) ?? 0;

    if (id != undefined && id != "") {
        try {
            let user = await Users.findOne({ _id: id }).populate({
                path: "notifications",
                populate: {
                    path: "invitation",
                },
            }).skip(page * 30).limit(30).sort("updatedAt");
            console.log(user)
            return res.status(200).send({
                success: true, message: "ok", results: {
                    notifications: user.notifications,
                },
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({ success: false, message: "Server Error", results: null });
        }
    } else {
        res.status(400).send({ success: false, message: "please enter an id " });
    }
}




controller.readNotifcations = async (req, res) => {
    const id = req.user.user_id;
    const notificationsIds = req.body.notificationsIds;

    if (notificationsIds == undefined || notificationsIds != null) {
        return res.status(400).send({ success: false, message: "invalid id", results: null });
    } else {
        try {
            let notifications = await Notifications.update({ _id: { $in: notificationsIds } }, {
                "read": true
            });
            return res.status(200).send({ success: true, message: "ok", results: notifications });

        } catch (error) {
            return res.status(500).send({ success: false, message: "Server Error", results: null });
        }
    }
}


module.exports = controller;
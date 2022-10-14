const express = require("express");
const router = express.Router();
const ServiceRequest = require("../Models/ServiceRequest");
const Recruiter = require("../Models/Recruiters");
const Worker = require("../Models/Workers");
const Booking = require("../Models/Booking");
const notification = require("../Helpers/PushNotification");
const dayjs = require("dayjs");
const AddToCalendar = require("../Helpers/TimeAdder");

router.route("/service-request/:user").get(async function (req, res) {
  console.log(req.params.user);
  try {
    let queryResultWorker = await ServiceRequest.find({
      workerId: req.params.user,
    }).sort({ date: -1, requestStatus: 1 });
    let queryResultRecruiter = await ServiceRequest.find({
      recruiterId: req.params.user,
    }).sort({ date: -1, requestStatus: 1 });

    res.send({ worker: queryResultWorker, recruiter: queryResultRecruiter });
  } catch (error) {
    res.send(error);
  }
});
router.route("/service-request").post(async function (req, res) {
  try {
    console.log("asd");
    // req.body.serviceDate + "T" + req.body.startTime;
    let startTime = dayjs(
      req.body.serviceDate + "T" + req.body.startTime
    ).format("YYYY-MM-DDTHH:mm:ss");
    console.log(startTime);

    const pushID = await Worker.findOne(
      { _id: req.body.workerId },
      { pushtoken: 1, _id: 0 }
    ).lean();
    const serviceRequest = new ServiceRequest({
      workerId: req.body.workerId,
      recruiterId: req.body.recruiterId,
      workId: req.body.workId,
      subCategory: req.body.subCategory,
      address: req.body.address,
      minPrice: req.body.minPrice,
      maxPrice: req.body.maxPrice,
      serviceDate: req.body.serviceDate,
      startTime: startTime,
      description: req.body.description,
      geometry: { type: "point", coordinates: [req.body.long, req.body.lat] },
      requestStatus: 1,
    });
    console.log(pushID);
    serviceRequest.save(function (err) {
      if (!err) {
        res.send("New Service Request Created");
        notification(
          [pushID.pushtoken],
          "New Request",
          "New Request Check It out",
          req.body.workerId
        );
      } else {
        res.send(err);
      }
    });
  } catch (error) {
    res.send(error);
  }
});
//
router
  .route("/service-request/:user/:id")
  .put(async function (req, res) {
    try {
      const reqObj = {
        requestStatus: req.body.requestStatus,
        // endTime: req.body.endTime,
      };
      if (req.body.endDate !== undefined && req.body.endTime !== undefined) {
        // console.log("asd");
        let endTime = dayjs(req.body.endDate + "T" + req.body.endTime).format(
          "YYYY-MM-DDTHH:mm:ss"
        );
        reqObj.endTime = endTime;
      }
      // console.log(reqObj);
      let result;
      result = await ServiceRequest.findOneAndUpdate(
        { _id: req.params.id },
        reqObj,
        { new: true }
      );
      const { workerId, recruiterId } = result;
      const pushIDWorker = await Worker.findOne(
        { _id: workerId },
        { pushtoken: 1, _id: 0 }
      ).lean();
      const pushIDRecruiter = await Recruiter.findOne(
        { _id: recruiterId },
        { pushtoken: 1, _id: 0 }
      ).lean();
      // console.log(pushIDWorker, pushIDRecruiter);

      if (req.body.requestStatus == 2) {
        //create booking
        const tr = await Booking.create({
          workerId: result.workerId,
          recruiterId: result.recruiterId,
          workId: result.workId,
          subCategory: result.subCategorys,
          minPrice: result.minPrice,
          maxPrice: result.maxPrice,
          serviceDate: result.serviceDate,
          startTime: result.startTime,
          endTime: result.endTime,
          description: result.description,
          bookingStatus: 1,
          geometry: {
            type: "point",
            coordinates: [
              result.geometry.coordinates[0],
              result.geometry.coordinates[1],
            ],
          },
        });
        AddToCalendar(tr);

        //put delete flag to true
        await ServiceRequest.findOneAndUpdate(
          { _id: req.params.id },
          {
            deleteflag: true,
          }
        );
        // notify recruiter
        // notification(
        //   [pushIDRecruiter.pushtoken],
        //   "Accepted",
        //   "your request has been accepted",
        //   recruiterId
        // );
      } else if (req.body.requestStatus == 3) {
        notification(
          [pushIDRecruiter.pushtoken],
          "Rejected",
          "your request has been rejected",
          recruiterId
        );
      } else if (req.body.requestStatus == 4) {
        notification(
          [pushIDWorker.pushtoken],
          "Cancelled",
          "Recruiter Cancelled the request",
          workerId
        );
      }

      res.send(result);
    } catch (error) {
      res.send(error);
    }
  })
  .get(async function (req, res) {
    try {
      let queryResult = await ServiceRequest.find({ _id: req.params.id });
      res.send(queryResult);
    } catch (error) {
      res.send(error);
    }
  })
  .delete(async function (req, res) {
    ServiceRequest.findByIdAndUpdate(
      { _id: req.params.id },
      { deleteflag: true },
      function (err) {
        if (!err) {
          res.send("Deleted Succesfully");
        }
      }
    );
  });
router.route("/service-request-comment/:id").post(async function (req, res) {
  ServiceRequest.findOneAndUpdate(
    { _id: req.params.id },
    {
      comment: req.body.comment,
    },
    function (err) {
      if (!err) {
        res.send("Success");
      } else {
        console.log(err);
      }
    }
  );
});

module.exports = router;

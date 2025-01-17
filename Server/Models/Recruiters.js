const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    firstname: String,
    lastname: String,
    middlename: String,
    birthday: Date,
    age: Number,
    sex: String,
    street: String,
    purok: String,
    barangay: String,
    city: String,
    province: String,
    phoneNumber: String,
    emailAddress: String,
    profilePic: String,
    GovId: String,
    verification: Boolean,
    accountStatus: String,
    pushtoken: { type: String, default: "" },

    role: String,
    // comments: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Recruitercomment",
    //   },
    // ],
    rating: Number,
    liveness: String,
    deleteflag: { type: Boolean, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recruiter", recruiterSchema);

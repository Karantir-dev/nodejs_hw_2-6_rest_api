const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const contact = new Schema(
  {
    name: { type: String, minlength: 2, maxlength: 30 },
    email: { type: String },
    phone: { type: String },
    favorite: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true }
);

const Contact = model("contact", contact);

module.exports = Contact;

const mongoose = require("mongoose");
const mogoosePaginate = require("mongoose-paginate-v2");
const { Schema, model, SchemaTypes } = mongoose;

const contact = new Schema(
  {
    name: { type: String, minlength: 2, maxlength: 30 },
    email: { type: String },
    phone: { type: String },
    favorite: { type: Boolean, default: false },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

contact.plugin(mogoosePaginate);

const Contact = model("contact", contact);

module.exports = Contact;

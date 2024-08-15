const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("./User");

const MapMarkerSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    position: {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
      elevation: {
        type: Number,
      },
    },
    locked: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
    },
    workspace_id: {
      type: String,
      required: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = MapMarker = mongoose.model("mapmarkers", MapMarkerSchema);

const Address = require("../../Database/models/Addres.js");
const http = require("../folderS,F,E/S,F,E.JS");
const Responsers = require("../utilites/httperespons.js");

const addAddress = async (req, res) => {
  try {
    const { payload } = req.body;
    if (payload.address) {
      let updatedAddress;
      if (payload.address._id) {
        updatedAddress = await Address.findOneAndUpdate(
          { user: req.user._id, "address._id": payload.address._id },
          {
            $set: {
              "address.$": payload.address,
            },
          },
          { new: true }
        );
      } else {
        updatedAddress = await Address.findOneAndUpdate(
          { user: req.user._id },
          { $push: { address: payload.address } },
          { new: true, upsert: true }
        );
      }
      return httperespons.Second(res, updatedAddress, 200, http.SUCCESS)
    } else {
      httperespons.First(res, ["Address parameter is required"], 400, http.FAIL);
    }
  } catch (error) {
    console.error("Error adding address:", error);
    return httperespons.Third(res, ["Internal Server Error"], 500, http.ERROR);
  }
};

const getAddress = async (req, res) => {
  try {
    const getAddress = await Address.findOne({ user: req.user._id });
    if (!getAddress) {
      httperespons.First(res, [], 400, http.FAIL);
    } else {
      httperespons.Second(res, getAddress, 200, http.SUCCESS);
    }
  } catch (err) {
    console.log(err);
    httperespons.Third(res, ["Error in here:"], 500, http.ERROR);
  } finally {
    res.end();
  }
};

const upDateAddress = async (req, res) => {
  try {
    const search = req.params.id; // corrected variable name
    const newData = req.body; // corrected variable name
    const getProduct = await Address.findByIdAndUpdate(search, newData, {
      new: true,
      runValidators: true,
    });
    if (!getProduct) {
      Responsers.Firest(res, [], 400, http.FAIL); // Assuming Responsers.Firest handles failure
    } else {
      Responsers.Schand(res, "Done Update", 200, http.SUCCESS); // Assuming Responsers.Schand handles success
    }
  } catch (error) {
    console.log(error);
    Responsers.Thered(res, [], 500, http.ERROR); // Assuming Responsers.Thered handles errors
  }
};

const DeleteAddress = async (req, res) => {
  try {
    const search = req.params.id; // corrected variable name
    const getProduct = await Address.findByIdAndDelete(search);
    if (!getProduct) {
      Responsers.Firest(res, [], 400, http.FAIL); // Assuming Responsers.Firest handles failure
    } else {
      Responsers.Schand(res, "Done Delete", 200, http.SUCCESS); // Assuming Responsers.Schand handles success
    }
  } catch (error) {
    console.log(error);
    Responsers.Thered(res, [], 500, http.ERROR); // Assuming Responsers.Thered handles errors
  }
};

module.exports = {
  addAddress,
  getAddress,
  upDateAddress,
  DeleteAddress,
};

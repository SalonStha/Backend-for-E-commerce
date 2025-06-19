class CommonService {
  constructor(model) {
    this.model = model;
  }
  async create(data) {
    try {
      const dataObject = new this.model(data);
      return await dataObject.save();
    } catch (error) {
      throw error;
    }
  }

  async getSingleDataById(filter) {
    try {
      const data = await this.model
        .findOne(filter)
        .populate("createdBy", [
          "_id",
          "firstName",
          "lastName",
          "email",
          "role",
          "status",
          "image",
        ]) //This means the createdBy field in a Brand document stores an ObjectId that references a document in the User collection.
        // The .populate("createdBy") part tells Mongoose: "Hey, when you fetch a brand, don't just give me the ID for createdBy. Go find the actual User document that this ID refers to and put it here instead
        .populate("updatedBy", [
          "_id",
          "firstName",
          "lastName",
          "email",
          "role",
          "status",
          "image",
        ]);
      return data;
    } catch (error) {
      throw error;
    }
  }
  async updateSingleDataById(filter, data) {
    try {
      const updatedData = await this.model.findOneAndUpdate(
        filter,
        { $set: data },
        { new: true }
      );
      return updatedData;
    } catch (error) {
      throw error;
    }
  }
  async deleteSingleDataById(filter) {
    try {
      const deletedData = await this.model.findOneAndDelete(filter);
      return deletedData;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CommonService;

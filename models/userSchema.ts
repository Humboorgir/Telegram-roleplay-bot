import mongoose from 'mongoose';
const { Schema } = mongoose;

const reqString = {
  type: String, required: true
}

const reqNumber = {
  type: Number, required: true
}

const userSchema = new Schema({
  username: reqString,
  obohat: reqNumber
});

const userModel = mongoose.model('User', userSchema);

export default userModel;
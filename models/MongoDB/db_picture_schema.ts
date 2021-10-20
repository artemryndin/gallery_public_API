import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const pictureSchema = new Schema({
  path: {
    type: String,
    required: true,
  },
  metadata: {
    type: Object,
    required: true,
  },
  owner: {
    type: String,
    ref: 'testUsersModel',
  },
});

const picturesModel = mongoose.model('Pictures', pictureSchema);
export { picturesModel };

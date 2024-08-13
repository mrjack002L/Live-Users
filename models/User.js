const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  mobileNo: {
    type: String,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid 10-digit mobile number!`
    }
  },
  email: {
    type: String,
    validate: {
      validator: function(v) {
        return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  street: String,
  city: String,
  state: String,
  country: String,
  loginId: {
    type: String,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9]{8}$/.test(v);
      },
      message: props => `${props.value} is not a valid 8-character alphanumeric login ID!`
    }
  },
  password: {
    type: String,
    validate: {
      validator: function(v) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/.test(v);
      },
      message: props => `Password must be at least 6 characters long, contain 1 uppercase letter, 1 lowercase letter, and 1 special character!`
    }
  },
  creationTime: { type: Date, default: Date.now },
  lastUpdatedOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

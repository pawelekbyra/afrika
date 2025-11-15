
const User = require('../models/User');

const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
    });
  } else {
    res.status(404).json({ msg: 'User not found' });
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);

  if (user && (await user.matchPassword(currentPassword))) {
    user.password = newPassword;
    await user.save();
    res.json({ msg: 'Password changed successfully' });
  } else {
    res.status(401).json({ msg: 'Invalid current password' });
  }
};

const deleteAccount = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    await user.deleteOne();
    res.json({ msg: 'User removed' });
  } else {
    res.status(404).json({ msg: 'User not found' });
  }
};

module.exports = { updateUserProfile, changePassword, deleteAccount };

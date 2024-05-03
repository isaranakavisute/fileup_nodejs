const controllers = require('./controllers')
const hooks = require('./hooks')

  const userRoute = (app) => {
    app.get('/me', { preHandler: [hooks.auth.validateToken] }, controllers.user.getMyProfile);
    app.get('/user/:id', { preHandler: [hooks.auth.validateToken] }, controllers.user.getUserById);
    app.post('/user/register', controllers.user.createUser);
    app.patch('/updateProfile', { preHandler: [hooks.auth.validateToken] }, controllers.user.updateUser);
    app.patch('/user/change-password', { preHandler: [hooks.auth.validateToken] }, controllers.user.changePassword);
    app.patch('/user/change-phonenumber/:id', { preHandler: [hooks.auth.validateToken] }, controllers.user.changePhoneNumber);
    app.patch('/user/reset-password/:id', { preHandler: [hooks.auth.validateToken] }, controllers.user.resetPassword);
    app.post('/user/login', controllers.user.loginUser);
    app.patch('/user/logout', { preHandler: [hooks.auth.validateToken] }, controllers.user.logoutUser);
    app.delete('/user/:id', { preHandler: [hooks.auth.validateToken] }, controllers.user.deleteUserById);
  };

module.exports ={
    userRoute,
}
connectToDatabase()
  .then(database => getUser(database, 'email@email.com'))
  .then(user => getUserSettings(database, user.id))
  .then(success => setRole(database, user.id, "ADMIN"))
  .then(success => notifyUser(user.id, "USER_ROLE_UPDATED"))
  .then(success => notifyAdmins("USER_ROLE_UPDATED"))


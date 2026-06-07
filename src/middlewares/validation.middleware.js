const validateRegister = (req, res, next) => {
  const { name, email, username, password } = req.body;

  if (!name || !email || !username || !password) {
    return res.status(400).json({
      error: 'Datos incompletos',
      message: 'Nombre, correo, usuario y contrasena son requeridos'
    });
  }

  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,100}$/;
  if (!nameRegex.test(name)) {
    return res.status(400).json({
      error: 'Datos invalidos',
      message: 'El nombre solo puede contener letras y espacios'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: 'Datos invalidos',
      message: 'El correo no tiene un formato valido'
    });
  }

  const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      error: 'Datos invalidos',
      message: 'El usuario solo puede contener letras, numeros y guion bajo'
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      error: 'Datos invalidos',
      message: 'La contrasena debe tener minimo 8 caracteres'
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Datos incompletos',
      message: 'Correo y contrasena son requeridos'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: 'Datos invalidos',
      message: 'El correo no tiene un formato valido'
    });
  }

  next();
};

const validateChangePassword = (req, res, next) => {
  const { current_password, new_password } = req.body;

  if (!current_password || !new_password) {
    return res.status(400).json({
      error: 'Datos incompletos',
      message: 'La contrasena actual y la nueva son requeridas'
    });
  }

  if (new_password.length < 8) {
    return res.status(400).json({
      error: 'Datos invalidos',
      message: 'La nueva contrasena debe tener minimo 8 caracteres'
    });
  }

  if (current_password === new_password) {
    return res.status(400).json({
      error: 'Datos invalidos',
      message: 'La nueva contrasena debe ser diferente a la actual'
    });
  }

  next();
};

const validateComment = (req, res, next) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({
      error: 'Datos incompletos',
      message: 'El contenido del comentario es requerido'
    });
  }

  if (content.trim().length < 1 || content.length > 1000) {
    return res.status(400).json({
      error: 'Datos invalidos',
      message: 'El comentario debe tener entre 1 y 1000 caracteres'
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateChangePassword,
  validateComment
};
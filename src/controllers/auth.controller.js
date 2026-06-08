const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');

const register = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    // Si se subio una imagen la convertimos a base64 para guardarla
    let profile_picture = null;
    if (req.file) {
      const base64 = req.file.buffer.toString('base64');
      profile_picture = `data:${req.file.mimetype};base64,${base64}`;
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existingEmail) {
      return res.status(400).json({
        error: 'Datos invalidos',
        message: 'El correo ya esta registrado'
      });
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username: username.toLowerCase().trim() }
    });

    if (existingUsername) {
      return res.status(400).json({
        error: 'Datos invalidos',
        message: 'El nombre de usuario ya esta en uso'
      });
    }

    // Hashear contrasena antes de guardar
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        username: username.toLowerCase().trim(),
        password: hashedPassword,
        profile_picture
      }
    });

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      redirect: '/login',
      user_id: user.id
    });

  } catch (error) {
    console.error('Error en registro:', error.message);
    return res.status(500).json({
      error: 'Error interno',
      message: 'Ocurrio un error al registrar el usuario'
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase().trim() }
    });

    // Mismo mensaje para no revelar si el usuario existe
    if (!user) {
      return res.status(401).json({
        error: 'No autorizado',
        message: 'Credenciales incorrectas'
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        error: 'No autorizado',
        message: 'Credenciales incorrectas'
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 2);

    return res.status(200).json({
      token_type: 'Bearer',
      access_token: token,
      expiration: expiration.toISOString()
    });

  } catch (error) {
    console.error('Error en login:', error.message);
    return res.status(500).json({
      error: 'Error interno',
      message: 'Ocurrio un error al iniciar sesion'
    });
  }
};

const me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        profile_picture: true,
        created_at: true
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Usuario no encontrado'
      });
    }

    return res.status(200).json({ user });

  } catch (error) {
    console.error('Error en me:', error.message);
    return res.status(500).json({
      error: 'Error interno',
      message: 'Ocurrio un error al obtener el perfil'
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Usuario no encontrado'
      });
    }

    const passwordMatch = await bcrypt.compare(current_password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        error: 'No autorizado',
        message: 'La contrasena actual es incorrecta'
      });
    }

    // Hashear contrasena antes de guardar
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(new_password, saltRounds);

    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        password: hashedNewPassword,
        updated_at: new Date()
      }
    });

    return res.status(200).json({
      message: 'Contrasena actualizada correctamente'
    });

  } catch (error) {
    console.error('Error en changePassword:', error.message);
    return res.status(500).json({
      error: 'Error interno',
      message: 'Ocurrio un error al cambiar la contrasena'
    });
  }
};

module.exports = { register, login, me, changePassword };
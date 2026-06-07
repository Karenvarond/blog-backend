const prisma = require('../config/database');

const getComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        user: {
          select: {
            username: true,
            profile_picture: true
          }
        }
      }
    });

    return res.status(200).json({
      message: 'Comentarios obtenidos correctamente',
      data: comments
    });

  } catch (error) {
    console.error('Error en getComments:', error.message);
    return res.status(500).json({
      error: 'Error interno',
      message: 'Ocurrio un error al obtener los comentarios'
    });
  }
};

const createComment = async (req, res) => {
  try {
    const { content } = req.body;

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        user_id: req.user.id
      },
      include: {
        user: {
          select: {
            username: true,
            profile_picture: true
          }
        }
      }
    });

    return res.status(200).json({
      message: 'Comentario creado correctamente',
      data: comment
    });

  } catch (error) {
    console.error('Error en createComment:', error.message);
    return res.status(500).json({
      error: 'Error interno',
      message: 'Ocurrio un error al crear el comentario'
    });
  }
};

module.exports = { getComments, createComment };

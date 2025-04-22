// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware para proteger rotas
exports.protect = async (req, res, next) => {
  let token;

  // 1. Verificar se o token existe no header Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Acesso não autorizado - Token não fornecido",
    });
  }

  try {
    // 2. Verificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Verificar se o usuário ainda existe
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "O usuário deste token não existe mais",
      });
    }

    // 4. Acesso concedido - usuário adicionado ao request
    req.user = currentUser;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Acesso não autorizado - Token inválido",
    });
  }
};

// Middleware para autorizar por roles (admin, user, etc)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Usuário com role ${req.user.role} não tem acesso a esta rota`,
      });
    }
    next();
  };
};

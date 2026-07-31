import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const dominio = process.env.EMAIL_DOMAIN;

export const authorizeUser = async (req, res) => {
  try {
    const { email } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    if (!normalizedEmail.endsWith(`@${dominio}`)) {
      return res.status(400).json({
        message: "Dominio inválido",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "El usuario ya existe o ya fue autorizado",
      });
    }

    const newUser = await User.create({
      email: normalizedEmail,
      enabled: true,
      signupCompleted: false,
      role: "user",
      passwordHash: null,
    });

    return res.status(201).json({
      message: "Usuario autorizado correctamente",
      user: {
        _id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        enabled: newUser.enabled,
        signupCompleted: newUser.signupCompleted,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error al autorizar usuario",
    });
  }
};

export const getAuthorizedUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "email enabled signupCompleted role createdAt",
    );

    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({
      message: "Error al obtener usuarios",
    });
  }
};

export const toggleUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    user.enabled = !user.enabled;

    await user.save();

    return res.status(200).json({
      message: user.enabled ? "Usuario habilitado" : "Usuario deshabilitado",
      enabled: user.enabled,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error al actualizar usuario",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    user.passwordHash = null;
    user.signupCompleted = false;
    user.enabled = true;

    await user.save();

    return res.status(200).json({
      message: "Contraseña reseteada correctamente",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error al resetear contraseña",
    });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ["admin", "supervisor", "user"];

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: "Rol inválido",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    user.role = role;

    await user.save();

    return res.status(200).json({
      message: "Rol actualizado correctamente",
      role: user.role,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error al actualizar rol",
    });
  }
};

import bcrypt from "bcrypt";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    if (!normalizedEmail.endsWith("@emova.com.ar")) {
      return res.status(400).json({
        message: "Dominio de email inválido",
      });
    }

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(403).json({
        message: "Usuario no autorizado",
      });
    }

    if (!user.enabled) {
      return res.status(403).json({
        message: "Usuario deshabilitado",
      });
    }

    if (user.signupCompleted) {
      return res.status(400).json({
        message: "La cuenta ya fue creada",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    user.passwordHash = passwordHash;
    user.signupCompleted = true;

    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Error al crear la cuenta",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+passwordHash");

    if (!user) {
      return res.status(401).json({
        message: "Usuario no registrado",
      });
    }

    if (!user.enabled) {
      return res.status(403).json({
        message: "Usuario deshabilitado",
      });
    }

    if (!user.signupCompleted) {
      return res.status(403).json({
        message: `La cuenta todavía no fue activada.
Creá tu contraseña en "Crear cuenta"`,
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Contraseña incorrecta",
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Error al iniciar sesión",
    });
  }
};

export const checkEmail = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.params.email,
    }).select("enabled signupCompleted");

    if (!user) {
      return res.json({
        exists: false,
      });
    }

    res.json({
      exists: true,
      enabled: user.enabled,
      signupCompleted: user.signupCompleted,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error al verificar email",
    });
  }
};

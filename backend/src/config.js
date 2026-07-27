import "dotenv/config";

const config = {
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET || "dev-secret-inseguro",
  jwtExpiresIn: "8h",
};

if (!process.env.JWT_SECRET) {
  console.warn("[config] JWT_SECRET não definido — usando segredo de desenvolvimento.");
}

export default config;

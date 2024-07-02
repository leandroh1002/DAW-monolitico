require("dotenv").config();

const express = require("express"); // en esta instancia montamos la aplicacion
const mongoose = require("mongoose");

const app = express();

// el DB_PATH que use en este caso tuve que forzarlo en ipv4 porque no funcionaba la direccion default que es ipv6
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/automoviles"); // en esta parte se realiza la conexion entre mongoose y la base de datos de mongoDB

// const Auto = require("./modelo/autos")

const PORT = process.env.PORT || 3000;

const Schema = mongoose.Schema;

const AutoSchema = new Schema(
  {
    // en esta parte se saco el id, para que mongo controle la generacion de un id unico por default
    imagen: String,
    color: String,
    marca: String,
    modelo: String,
  },
  { versionKey: false }
); // Esto deshabilita el campo __v

// Crear el modelo a partir del esquema
const Auto = mongoose.model("Auto", AutoSchema);

// Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.use(express.json()); // la comunicacion se hace en formato json

app.use((req, res, next) => {
  // Establece que las peticiones se establecen en formato json
  res.header("Content-type", "application/json; charset=utf8");
  next();
});

// definir los endpoint
// este GET se encarga de buscar en la base de datos todos los autos generados
app.get("/api/autos", async (req, res) => {
  try {
    const autos = await Auto.find();
    res.status(200).json(autos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
});

// este POST permite generar una carga de un auto nuevo con los campos definidos en el modelo
app.post("/api/autos", async (req, res) => {
  const datos_auto = { ...req.body };
  const auto1 = new Auto(datos_auto);
  try {
    await auto1.save();
    res.status(201).send(JSON.stringify(auto1));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
});

app.delete("/api/autos/:_id", async (req, res) => {
  const id_auto = req.params.id;
  try {
    await Auto.findByIdAndDelete(id_auto);
    res.status(200).json("Auto eliminado correctamente");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
});

app.put("/api/autos/:_id", async (req, res) => {
  const id_auto = req.params.id;
  const newData = req.body; // Los nuevos datos a actualizar se deben enviar en el cuerpo de la solicitud

  try {
    // Utilizar findByIdAndUpdate para buscar el Auto por ID y actualizar sus datos
    const updatedAuto = await Auto.findByIdAndUpdate(id_auto, newData, { new: true });

    if (!updatedAuto) {
      // Si no se encuentra el Auto con el ID proporcionado, devolver un error
      return res.status(404).json({ error: "Auto no encontrado" });
    }

    // Si se actualiza correctamente, devolver el Auto actualizado
    res.status(200).json(updatedAuto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
});

// Esta parte define el puerto de la conexion del server local
const server = app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});

module.exports = { app, server };

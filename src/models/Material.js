import { Schema, model, Types } from "mongoose";
import {
  getCovertExchangePair,
  getDolarRateDolarApi,
  getEuroRateDolarApi,
} from "../functions/fetchs.js";

const MaterialSchema = new Schema(
  {
    image: {
      type: String,
      default: "/img/no-fotosColor.png",
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    precio: {
      type: Number,
      required: true,
    },
    moneda: {
      type: String,
      required: true,
      enum: ["USD", "EUR", "ARS"],
    },
    fuente: {
      type: String,
    },
    unit: {
      type: Types.ObjectId,
      ref: "Unit",
    },

    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subcategory: {
      type: Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },

    created: {
      type: Types.ObjectId,
      ref: "User",
    },

    precioEnPesos: {
      type: Number,
      default: 0,
    },

    precioEnDolares: {
      type: Number,
      default: 0,
    },

    precioEnEuros: {
      type: Number,
      default: 0,
    },
    historialPrecio: {
      type: [
        {
          precio: Number,
          fecha: Date,
          moneda: String,
          precioEnPesos: Number,
          precioEnDolares: Number,
          precioEnEuros: Number,
          valorDolar: Number,
          valorEuro: Number,
          fechaCotizacionDolar: Date,
          fechaCotizacionEuro: Date,
          precioEnDolares: Number,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

MaterialSchema.pre("save", async function (next) {
  try {
    // Si no se ha modificado el precio, no hacemos nada con el historial
    if (!this.isModified("precio")) {
      return next();
    }

    // let valorDolarHoy = await getCovertExchangePair("USD", "ARS");
    // let valorEuroHoy = await getCovertExchangePair("EUR", "ARS");
    let valorEuroHoy2 = await getEuroRateDolarApi();
    let { dolarBlue, dolarOficial } = await getDolarRateDolarApi();
    console.log("preio EURO DENTRO DEL PRESAVE");
    console.log(valorEuroHoy2);
    console.log(dolarOficial);

    // Prepara la entrada de historial
    const newPriceEntry = {
      precio: this.precio,
      fecha: Date.now(),
      moneda: this.moneda,
      // valorDolar: valorDolarHoy.tipo_cambio,
      valorDolar: dolarOficial.venta,
      // valorEuro: valorEuroHoy.tipo_cambio,
      valorEuro: valorEuroHoy2.euroOficial.venta,
      fechaCotizacionDolar: dolarOficial.fechaActualizacion,
      fechaCotizacionEuro: valorEuroHoy2.euroOficial.fechaActualizacion,
    };

    // Calcular precios en diferentes monedas
    if (this.moneda === "USD") {
      // const { tipo_cambio: tipoCambioUSDAPesos } = await getCovertExchangePair(
      //   "USD",
      //   "ARS"
      // );
      // this.precioEnPesos = this.precio * tipoCambioUSDAPesos;
      this.precioEnPesos = this.precio * dolarOficial.venta;
      this.precioEnDolares = this.precio;
      // this.precioEnEuros =
      //   this.precio * (await getCovertExchangePair("USD", "EUR")).tipo_cambio;
      this.precioEnEuros = this.precio * valorEuroHoy2.euroOficial.venta;
    } else if (this.moneda === "EUR") {
      // const { tipo_cambio: tipoCambioEURAPesos } = await getCovertExchangePair(
      //   "EUR",
      //   "ARS"
      // );
      // this.precioEnPesos = this.precio * tipoCambioEURAPesos;
      this.precioEnPesos = this.precio * valorEuroHoy2.euroOficial.venta;
      // this.precioEnDolares =
      //   this.precio * (await getCovertExchangePair("EUR", "USD")).tipo_cambio;
      this.precioEnDolares =
        (this.precio * valorEuroHoy2.euroOficial.venta) / dolarOficial.venta;
      this.precioEnEuros = this.precio;
    } else if (this.moneda === "ARS") {
      // const { tipo_cambio: tipoCambioUSDAPesos } = await getCovertExchangePair(
      //   "USD",
      //   "ARS"
      // );
      this.precioEnPesos = this.precio;
      // this.precioEnDolares = this.precio / tipoCambioUSDAPesos;
      this.precioEnDolares = this.precio / dolarOficial.venta;
      // this.precioEnEuros =
      //   this.precio / (await getCovertExchangePair("EUR", "ARS")).tipo_cambio;
      this.precioEnEuros = this.precio / valorEuroHoy2.euroOficial.venta;
    }

    // Asignar los precios calculados al objeto actual
    newPriceEntry.precioEnPesos = this.precioEnPesos;
    newPriceEntry.precioEnDolares = this.precioEnDolares;
    newPriceEntry.precioEnEuros = this.precioEnEuros;

    // Verificar si ya existe un precio en el historial para la fecha actual
    const existingPriceIndex = this.historialPrecio.findIndex(
      (entry) => entry.fecha.toString() === newPriceEntry.fecha.toString()
    );

    if (existingPriceIndex !== -1) {
      // Si existe, actualizar el historial
      this.historialPrecio[existingPriceIndex] = {
        ...this.historialPrecio[existingPriceIndex],
        ...newPriceEntry, // Actualizar los campos con la nueva entrada
      };
    } else {
      // Si no existe, agregar un nuevo registro al historial
      this.historialPrecio.push(newPriceEntry);
    }

    next();
  } catch (error) {
    console.error("Error en el pre-save:", error);
    next(error);
  }
});

export const MaterialModel = model("Material", MaterialSchema);

// import { Schema, model, Types } from "mongoose";
// import { getCovertExchangePair } from "../functions/fetchs.js";

// const MaterialSchema = new Schema(
//   {
//     image: {
//       type: String,
//       default: "/img/no-fotosColor.png"
//     },
//     name: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     precio: {
//       type: Number,
//       required: true,
//     },
//     moneda: {
//       type: String,
//       required: true,
//       enum: ["USD", "EUR", "ARS"],
//     },
//     unit: {
//       type: Types.ObjectId,
//       ref: "Unit",
//     },

//     category: {
//       type: Types.ObjectId,
//       ref: "Category",
//       required: true,
//     },

//     subcategory: {
//       type: Types.ObjectId,
//       ref: "Subcategory",
//       required: true,
//     },

//     precioEnPesos: {
//       type: Number,
//       default: 0,
//     },

//     precioEnDolares: {
//       type: Number,
//       default: 0,
//     },

//     precioEnEuros: {
//       type: Number,
//       default: 0,
//     },
//     historialPrecio: {
//       type: [
//         {
//           precio: Number,
//           fecha: Date,
//           moneda: String,
//           precioEnPesos: Number,
//           precioEnDolares: Number,
//           precioEnEuros: Number,
//           valorDolar: Number,
//           valorEuro: Number,
//           fechaCotizaciones: Date,
//           precioEnDolares: Number,
//         },
//       ],
//       default: [],
//     },
//   },
//   {
//     timestamps: true,
//     versionKey: false,
//   }
// );

// MaterialSchema.pre("save", async function (next) {
//   try {
//     if (!this.isModified("precio")) {
//       return next(); // Si no se ha modificado, continuar sin agregar al historial
//     }
//     let valorDolarHoy = await getCovertExchangePair("USD", "ARS");
//     let valorEuroHoy = await getCovertExchangePair("EUR", "ARS");
//     console.log("valorDolarHoy");
//     console.log(valorDolarHoy);
//     if (this.moneda === "USD") {
//       const { tipo_cambio: tipoCambioUSDAPesos } = await getCovertExchangePair(
//         "USD",
//         "ARS"
//       );
//       this.precioEnPesos = this.precio * tipoCambioUSDAPesos;
//       const { tipo_cambio: tipoCambioUSDEUR } = await getCovertExchangePair(
//         "USD",
//         "EUR"
//       );
//       this.precioEnEuros = this.precio * tipoCambioUSDEUR;
//       this.precioEnDolares = this.precio;
//       this.historialPrecio.push({
//         precio: this.precio,
//         fecha: Date.now(),
//         moneda: this.moneda,
//         precioEnPesos: this.precioEnPesos,
//         precioEnDolares: this.precioEnDolares,
//         precioEnEuros: this.precioEnEuros,
//         valorDolar: valorDolarHoy.tipo_cambio,
//         valorEuro: valorEuroHoy.tipo_cambio,
//         fechaCotizaciones: valorDolarHoy.lastUpdate,
//       });
//     } else if (this.moneda === "EUR") {
//       const { tipo_cambio: tipoCambioEURAPesos } = await getCovertExchangePair(
//         "EUR",
//         "ARS"
//       );
//       this.precioEnPesos = this.precio * tipoCambioEURAPesos;
//       const { tipo_cambio: tipoCambioEURUSD } = await getCovertExchangePair(
//         "EUR",
//         "USD"
//       );
//       this.precioEnDolares = this.precio * tipoCambioEURUSD;
//       this.precioEnEuros = this.precio;

//       this.historialPrecio.push({
//         precio: this.precio,
//         fecha: Date.now(),
//         moneda: this.moneda,
//         precioEnPesos: this.precioEnPesos,
//         precioEnDolares: this.precioEnDolares,
//         precioEnEuros: this.precioEnEuros,
//         valorDolar: valorDolarHoy.tipo_cambio,
//         valorEuro: valorEuroHoy.tipo_cambio,
//         fechaCotizaciones: valorDolarHoy.lastUpdate,
//         precioEnDolares: this.precioEnDolares,
//       });
//     } else if (this.moneda === "ARS") {
//       const { tipo_cambio: tipoCambioUSDAPesos } = await getCovertExchangePair(
//         "USD",
//         "ARS"
//       );
//       this.precioEnDolares = this.precio / tipoCambioUSDAPesos;
//       const { tipo_cambio: tipoCambioEURAPesos } = await getCovertExchangePair(
//         "EUR",
//         "ARS"
//       );
//       this.precioEnEuros = this.precio / tipoCambioEURAPesos;
//       this.precioEnPesos = this.precio;

//       this.historialPrecio.push({
//         precio: this.precio,
//         fecha: Date.now(),
//         moneda: this.moneda,
//         precioEnPesos: this.precioEnPesos,
//         precioEnDolares: this.precioEnDolares,
//         precioEnEuros: this.precioEnEuros,
//         valorDolar: valorDolarHoy.tipo_cambio,
//         valorEuro: valorEuroHoy.tipo_cambio,
//         fechaCotizaciones: valorDolarHoy.lastUpdate,
//         precioEnDolares: this.precioEnDolares,
//       });
//     }

//     next();
//   } catch (error) {
//     console.error("Error en el pre-save:", error);
//     next(error);
//   }
// });

// export const MaterialModel = model("Material", MaterialSchema);

// import { Schema, model, Types } from "mongoose";
// import { getCovertExchangePair } from "../functions/fetchs.js";

// const MaterialSchema = new Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     precio: {
//       type: Number,
//       required: true,
//     },
//     moneda: {
//       type: String,
//       required: true,
//       enum: ["USD", "EUR", "ARS"],
//     },
//     unit: {
//       type: Types.ObjectId,
//       ref: "Unit",
//     },

//     category: {
//       type: Types.ObjectId,
//       ref: "Category",
//       required: true,
//     },

//     subcategory: {
//       type: Types.ObjectId,
//       ref: "Subcategory",
//       required: true,
//     },

//     precioEnPesos: {
//       type: Number,
//       default: 0,
//     },

//     precioEnDolares: {
//       type: Number,
//       default: 0,
//     },

//     precioEnEuros: {
//       type: Number,
//       default: 0,
//     },
//     historialPrecio: {
//       type: [
//         {
//           precio: Number,
//           fecha: Date,
//           moneda: String,
//           valorDolar: Number,
//           valorEuro: Number,
//           fechaCotizaciones: Date,
//           precioEnDolares: Number,
//         },
//       ],
//       default: [],
//     },
//   },
//   {
//     timestamps: true,
//     versionKey: false,
//   }
// );

// MaterialSchema.pre("save", async function (next) {
//   try {
//     let valorDolarHoy = await getCovertExchangePair("USD", "ARS");
//     let valorEuroHoy = await getCovertExchangePair("EUR", "ARS");
//     console.log("valorDolarHoy");
//     console.log(valorDolarHoy);
//     if (this.moneda === "USD") {
//       const { tipo_cambio: tipoCambioUSDAPesos } = await getCovertExchangePair(
//         "USD",
//         "ARS"
//       );
//       this.precioEnPesos = this.precio * tipoCambioUSDAPesos;
//       const { tipo_cambio: tipoCambioUSDEUR } = await getCovertExchangePair(
//         "USD",
//         "EUR"
//       );
//       this.precioEnEuros = this.precio * tipoCambioUSDEUR;
//       this.precioEnDolares = this.precio;
//       this.historialPrecio.push({
//         precio: this.precio,
//         fecha: Date.now(),
//         moneda: this.moneda,
//         valorDolar: valorDolarHoy.tipo_cambio,
//         valorEuro: valorEuroHoy.tipo_cambio,
//         fechaCotizaciones: valorDolarHoy.lastUpdate,
//       });
//     } else if (this.moneda === "EUR") {
//       const { tipo_cambio: tipoCambioEURAPesos } = await getCovertExchangePair(
//         "EUR",
//         "ARS"
//       );
//       this.precioEnPesos = this.precio * tipoCambioEURAPesos;
//       const { tipo_cambio: tipoCambioEURUSD } = await getCovertExchangePair(
//         "EUR",
//         "USD"
//       );
//       this.precioEnDolares = this.precio * tipoCambioEURUSD;
//       this.precioEnEuros = this.precio;

//       this.historialPrecio.push({
//         precio: this.precio,
//         fecha: Date.now(),
//         moneda: this.moneda,
//         valorDolar: valorDolarHoy.tipo_cambio,
//         valorEuro: valorEuroHoy.tipo_cambio,
//         fechaCotizaciones: valorDolarHoy.lastUpdate,
//         precioEnDolares: this.precioEnDolares,
//       });
//     } else if (this.moneda === "ARS") {
//       const { tipo_cambio: tipoCambioUSDAPesos } = await getCovertExchangePair(
//         "USD",
//         "ARS"
//       );
//       this.precioEnDolares = this.precio / tipoCambioUSDAPesos;
//       const { tipo_cambio: tipoCambioEURAPesos } = await getCovertExchangePair(
//         "EUR",
//         "ARS"
//       );
//       this.precioEnEuros = this.precio / tipoCambioEURAPesos;
//       this.precioEnPesos = this.precio;

//       this.historialPrecio.push({
//         precio: this.precio,
//         fecha: Date.now(),
//         moneda: this.moneda,
//         valorDolar: valorDolarHoy.tipo_cambio,
//         valorEuro: valorEuroHoy.tipo_cambio,
//         fechaCotizaciones: valorDolarHoy.lastUpdate,
//         precioEnDolares: this.precioEnDolares,
//       });
//     }

//     next();
//   } catch (error) {
//     console.error("Error en el pre-save:", error);
//     next(error);
//   }
// });

// export const MaterialModel = model("Material", MaterialSchema);

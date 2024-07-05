import { Schema, model, Types } from "mongoose";
import { getCovertExchangePair } from "../functions/fetchs.js";

const MaterialSchema = new Schema(
  {
    image: {
      type: String,
      default: "/img/no-fotosColor.png"
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
          valorDolar: Number,
          valorEuro: Number,
          fechaCotizaciones: Date,
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
    if (!this.isModified("precio")) {
      return next(); // Si no se ha modificado, continuar sin agregar al historial
    }
    let valorDolarHoy = await getCovertExchangePair("USD", "ARS");
    let valorEuroHoy = await getCovertExchangePair("EUR", "ARS");
    console.log("valorDolarHoy");
    console.log(valorDolarHoy);
    if (this.moneda === "USD") {
      const { tipo_cambio: tipoCambioUSDAPesos } = await getCovertExchangePair(
        "USD",
        "ARS"
      );
      this.precioEnPesos = this.precio * tipoCambioUSDAPesos;
      const { tipo_cambio: tipoCambioUSDEUR } = await getCovertExchangePair(
        "USD",
        "EUR"
      );
      this.precioEnEuros = this.precio * tipoCambioUSDEUR;
      this.precioEnDolares = this.precio;
      this.historialPrecio.push({
        precio: this.precio,
        fecha: Date.now(),
        moneda: this.moneda,
        valorDolar: valorDolarHoy.tipo_cambio,
        valorEuro: valorEuroHoy.tipo_cambio,
        fechaCotizaciones: valorDolarHoy.lastUpdate,
      });
    } else if (this.moneda === "EUR") {
      const { tipo_cambio: tipoCambioEURAPesos } = await getCovertExchangePair(
        "EUR",
        "ARS"
      );
      this.precioEnPesos = this.precio * tipoCambioEURAPesos;
      const { tipo_cambio: tipoCambioEURUSD } = await getCovertExchangePair(
        "EUR",
        "USD"
      );
      this.precioEnDolares = this.precio * tipoCambioEURUSD;
      this.precioEnEuros = this.precio;

      this.historialPrecio.push({
        precio: this.precio,
        fecha: Date.now(),
        moneda: this.moneda,
        valorDolar: valorDolarHoy.tipo_cambio,
        valorEuro: valorEuroHoy.tipo_cambio,
        fechaCotizaciones: valorDolarHoy.lastUpdate,
        precioEnDolares: this.precioEnDolares,
      });
    } else if (this.moneda === "ARS") {
      const { tipo_cambio: tipoCambioUSDAPesos } = await getCovertExchangePair(
        "USD",
        "ARS"
      );
      this.precioEnDolares = this.precio / tipoCambioUSDAPesos;
      const { tipo_cambio: tipoCambioEURAPesos } = await getCovertExchangePair(
        "EUR",
        "ARS"
      );
      this.precioEnEuros = this.precio / tipoCambioEURAPesos;
      this.precioEnPesos = this.precio;

      this.historialPrecio.push({
        precio: this.precio,
        fecha: Date.now(),
        moneda: this.moneda,
        valorDolar: valorDolarHoy.tipo_cambio,
        valorEuro: valorEuroHoy.tipo_cambio,
        fechaCotizaciones: valorDolarHoy.lastUpdate,
        precioEnDolares: this.precioEnDolares,
      });
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



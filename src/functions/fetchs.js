import axios from "axios";
import { config } from "../settings/config.js";

const api_URL_codes = `https://v6.exchangerate-api.com/v6/${config.api_key}/codes`;

export const getCurrentCodes = async () => {
  try {
    const response = await axios.get(api_URL_codes);
    if (response.status !== 200) {
      throw new Error("Error obteniendo los codigos" + response.statusText);
    }
    const codesWithName = response.data.supported_codes;
    return codesWithName;
  } catch (error) {
    console.error("Error:", error);
  }
};
//--------------------------------------------------------------------

export const getConvertExchangeAmount = async (
  moneda_origen,
  moneda_final,
  amount
) => {
  const api_URL_convert = `https://v6.exchangerate-api.com/v6/${config.api_key}/pair/${moneda_origen}/${moneda_final}/${amount}`;

  try {
    const response = await axios.get(api_URL_convert);
    const tipo_cambio = response.data.conversion_rate;
    const cantidad_convertida = amount * tipo_cambio;
    const formatted_conversion = new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: moneda_final,
    }).format(cantidad_convertida);

    return formatted_conversion;
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener el tipo de cambio");
  }
};

//-------------------------------------------------------------

export const getConvertExchangeLatest = async (moneda) => {
  const api_URL_convert = `https://v6.exchangerate-api.com/v6/${config.api_key}/latest/${moneda}`;

  try {
    const response = await axios.get(api_URL_convert);
    const conversion_rate = response.data.conversion_rates;
    return conversion_rate;
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener el tipo de cambio");
  }
};

//-------------------------------------------------------------

export const getCovertExchangePair = async (moneda_origen, moneda_final) => {
  const api_URL_convert = `https://v6.exchangerate-api.com/v6/${config.api_key}/pair/${moneda_origen}/${moneda_final}`;
  console.log("Dentro del fetch");
  console.log(api_URL_convert);
  try {
    const response = await axios.get(api_URL_convert);
    const tipo_cambio = response.data.conversion_rate;
    const lastUpdate = response.data.time_last_update_utc;
    return { tipo_cambio, lastUpdate };
  } catch (error) {
    if (error.response) {
      // El servidor respondió con un código de estado que está fuera del rango de 2xx
      console.error("Error status:", error.response.status);
      console.error("Error data:", error.response.data);
      console.error("Error headers:", error.response.headers);
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      console.error("Error request:", error.request);
    } else {
      // Algo sucedió al configurar la solicitud
      console.error("Error message:", error.message);
    }
    throw new Error("Error al obtener el tipo de cambio");
  }
};

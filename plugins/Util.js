const moment = require("moment");
const abbrev = require("./abbrev");
const renderEmoji = require("./renderEmoji");
const momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);

class Util {

  /**
   * Utilidades Canvacard
   */
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated!`);
  }

  /**
   * Valida hexadecimal
   * @param {string} hex Código hexadecimal para validar
   * @returns {boolean}
   */
  static validateHex(hex) {
    if (!hex || typeof hex !== "string") return false;
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  }

  /**
   * Convierte la marca de tiempo regular en discord como el tiempo
   * @param {Date|number} time Marca de tiempo para convertir
   * @returns {string}
   */
  static discordTime(time = new Date()) {
    let date = time && time instanceof Date ? time : new Date();
    let hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    let minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    return `Today at ${hours}:${minutes}`;
  }

  /**
   * Formatea la hora
   * @param {number} time Hora de formatear
   * @returns {string}
   */
  static formatTime(time) {
    if (!time) return "00:00";
    const fmt = moment.duration(time).format("dd:hh:mm:ss");

    const chunk = fmt.split(":");
    if (chunk.length < 2) chunk.unshift("00");
    return chunk.join(":");
  }

  /**
   * Acortar el texto.
   * @param {string} text Texto para acortar
   * @param {number} len Longitud máxima
   * @returns {string}
   */
  static shorten(text, len) {
    if (typeof text !== "string") return "";
    if (text.length <= len) return text;
    return text.substr(0, len).trim() + "...";
  }

  /**
   * Convierte números en unidades como "1K", "1M", "1B", etc.
   * @param {number|string} num
   * @returns {string} 
   * @returns {string}
   */
  static toAbbrev(num) {
    return abbrev(num);
  }

  /**
   * Renderiza texto con emoji
   * @param {CanvasRenderingContext2D} ctx CanvasRenderingContext2D
   * @param {string} msg Message
   * @param {number} x X
   * @param {number} y Y
   * @returns {Promise<void>}
   */
  static renderEmoji(ctx, msg, x, y) {
    return renderEmoji(ctx, msg, x, y);
  }

  /**
   * Devuelve código hexadecimal con formato
   * @param {string} hex Código hexadecimal para formatear
   * @param {string} alt Color alternativo
   * @returns {string}
   */
  static formatHex(hex, alt = "#000000") {
    if (!hex || typeof hex !== "string") return alt || "#000000";
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    if (hex.length !== 6) return alt || "#000000";

    return `#${hex}`;
  }

  /**
   * Invierte el color hexadecimal
   * @param {string} hex Código de color hexadecimal para invertir
   * @returns {string}
   */
  static invertColor(hex) {
    if (!hex || typeof hex !== "string") return "#FFFFFF";
    hex = hex.replace("#", "");

    // coincidir con el color hexadecimal
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    if (hex.length !== 6) return "#FFFFFF";

    // Colores invertidos
    const r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16);
    const g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16);
    const b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);

    // devolver nuevo hexadecimal
    const pad = (txt, length) => {
      length = length || 2;
      let arr = [length].join("0");
      return (arr + txt).slice(-length);
    };

    const finalHex = `#${pad(r)}${pad(g)}${pad(b)}`;
    return finalHex;
  }

  /**
   * Devuelve el acrónimo
   * @param {string} name Nombre para analizar el acrónimo
   * @returns {string}
   */
  static getAcronym(name) {
    if (!name || typeof name !== "string") return "";
    return name
      .replace(/'s /g, " ")
      .replace(/\w+/g, e => e[0])
      .replace(/\s/g, "");
  }

  /**
   * Devuelve una matriz de líneas
   * @param {object} params Parámetros
   * @param {string} text Texto
   * @param {CanvasRenderingContext2D} ctx CanvasRenderingContext2D
   * @param {number} maxWidth anchura máxima
   * @returns {string[]}
   */
  static getLines({ text, ctx, maxWidth }) {
    if (!text) return [];
    if (!ctx) throw new Error("¡No se proporcionó el contexto del lienzo!");
    if (!maxWidth) throw new Error("¡No se proporciona ancho máximo!");
    const lines = [];

    while (text.length) {
      let i;
      for (i = text.length; ctx.measureText(text.substr(0, i)).width > maxWidth; i -= 1);
      const result = text.substr(0, i);
      let j;
      if (i !== text.length) for (j = 0; result.indexOf(" ", j) !== -1; j = result.indexOf(" ", j) + 1);
      lines.push(result.substr(0, j || result.length));
      text = text.substr(lines[lines.length - 1].length, text.length);
    }

    return lines;
  }

}

module.exports = Util;
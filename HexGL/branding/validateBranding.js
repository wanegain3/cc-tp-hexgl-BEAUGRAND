/*
 * Validation pure du config de branding (branding/config.js).
 * Aucune dependance au DOM : utilisable tel quel sous Node (tests)
 * et dans le navigateur (branding/apply-branding.js).
 */

(function() {
  var exports;
  var HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;
  var REQUIRED_COLOR_KEYS = [
    "background",
    "accentPrimary",
    "accentSecondary",
    "accentTertiary",
    "textOnDark",
    "surfaceSecondary"
  ];

  function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
  }

  function validateBranding(config) {
    var errors = [];

    if (config == null || typeof config !== "object") {
      return { valid: false, errors: ["config manquant ou invalide"] };
    }

    if (!isNonEmptyString(config.name)) {
      errors.push("name manquant ou vide");
    }

    if (!isNonEmptyString(config.welcomeMessage)) {
      errors.push("welcomeMessage manquant ou vide");
    }

    if (config.logo == null || typeof config.logo !== "object") {
      errors.push("logo manquant ou invalide");
    } else {
      if (!isNonEmptyString(config.logo.src)) {
        errors.push("logo.src manquant ou vide");
      }
      if (!isNonEmptyString(config.logo.alt)) {
        errors.push("logo.alt manquant ou vide");
      }
    }

    if (config.colors == null || typeof config.colors !== "object") {
      errors.push("colors manquant ou invalide");
    } else {
      REQUIRED_COLOR_KEYS.forEach(function(key) {
        var value = config.colors[key];
        if (!isNonEmptyString(value) || !HEX_COLOR.test(value)) {
          errors.push("colors." + key + " manquant ou n'est pas une couleur hexadecimale valide (#RRGGBB)");
        }
      });
    }

    return { valid: errors.length === 0, errors: errors };
  }

  exports = exports != null ? exports : this;

  exports.branding || (exports.branding = {});

  exports.branding.validate = validateBranding;

}).call(this);

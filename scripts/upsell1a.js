


const EMAIL_OVERSIGHT_VALIDATE_URL = 'https://app-cms-api-proxy-prod-001.azurewebsites.net/integration/email-oversight/validate-public';

let isTest = sessionStorage.getItem("test");
if (isTest === null && isTest !== false) {
  isTest = false;
  sessionStorage.setItem("test", isTest);
}



// Get offer info from the campaign to determine VIP status
const orderSummary = JSON.parse(sessionStorage.getItem("orderSummary")) || [];

const getVrioCampaignInfoBasedOnPaymentMethod = (isVipUpsell) => {
    const vrioCampaigns = [{"_id":"69fe1be2a709c6f249d6124f","integration":[{"_id":"68de8b4ba7998abc5f77b02a","workspace":"develop","platform":"vrio","description":"production","fields":{"publicApiKey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6ImFkbWluIiwib3JnYW5pemF0aW9uIjoibXZtdC52cmlvIiwiaWQiOiJhZTE4OGY0ZC0yMDAwLTQ4ZWItOGE4YS03OGY1ZjBiMWQxZGMiLCJpYXQiOjE3NTU3MjQ1OTIsImF1ZCI6InVybjp2cmlvOmFwaTp1c2VyIiwiaXNzIjoidXJuOnZyaW86YXBpOmF1dGhlbnRpY2F0b3IiLCJzdWIiOiJ1cm46dnJpbzphcGk6MjIifQ.51xFtExTqVm3o2mhizx3VsiSTv7pNAB6beF1rmV_-Jg","internalApiKey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6ImFkbWluIiwib3JnYW5pemF0aW9uIjoibXZtdC52cmlvIiwiaWQiOiJhZTE4OGY0ZC0yMDAwLTQ4ZWItOGE4YS03OGY1ZjBiMWQxZGMiLCJpYXQiOjE3NTU3MjQ1OTIsImF1ZCI6InVybjp2cmlvOmFwaTp1c2VyIiwiaXNzIjoidXJuOnZyaW86YXBpOmF1dGhlbnRpY2F0b3IiLCJzdWIiOiJ1cm46dnJpbzphcGk6MjIifQ.51xFtExTqVm3o2mhizx3VsiSTv7pNAB6beF1rmV_-Jg"},"status":"active","createdAt":1758437407128,"updatedAt":1759415115447,"__v":0,"category":"CRM","id":"68de8b4ba7998abc5f77b02a"}],"externalId":"333","name":"Vital Shoulder Massager - Network - (1) - Germany","currency":"EUR","countries":[81],"metadata":{"campaign_id":333,"campaign_name":"","payment_type_id":1,"campaign_active":true,"campaign_prepaid":true,"campaign_payment_method_required":true,"campaign_group_transactions":true,"campaign_global_js":"","campaign_global_seo_title":"","campaign_global_seo_keywords":"","campaign_global_seo_description":"","date_created":"2026-05-08 17:22:42","created_by":0,"date_modified":"2026-05-08 17:22:42","modified_by":0,"campaign_notes":"","offers":[],"shipping_profiles":[],"campaignId":"333","externalId":333,"description":"","payment_methods":["amex","discover","visa","master"],"alternative_payments":[],"countries":[{"iso_numeric":276,"calling_code":"49","id":81,"name":"Germany","iso_2":"DE","iso_3":"DEU"}]},"funnels":[],"createdAt":1778249820869,"updatedAt":1778260962919,"packages":[],"status":"active","platform":"vrio","__v":0,"id":"69fe1be2a709c6f249d6124f"}];

    const vrioIntegration = vrioCampaigns.find(({ integration }) =>
      integration.find((int) => int.platform === 'vrio'),
    )?.integration.find((int) => int.platform === 'vrio');
    if (!vrioIntegration) {
      console.log('CRM Integration not available in funnel campaign.');
      throw new Error('CRM Integration not available in funnel campaign.');
    }

    // If this is a VIP page (recurring billing), try to find a VIP campaign
    // const campaignBasedOnBillingModel = vrioCampaigns.find((campaign) => {
    //   if (!campaign.name) {
    //     return false;
    //   }
    //   const isVipCampaign = campaign.name.toUpperCase().includes('VIP');
    //   if (isVipUpsell) {
    //     return isVipCampaign;
    //   }
    //   return !isVipCampaign;
    // });
    const campaignBasedOnBillingModel = vrioCampaigns[0];

    if (!campaignBasedOnBillingModel) {
      throw new Error(`No ${isVipUpsell ? 'VIP' : 'non-VIP'} campaign found in funnel.`);
    }

    const auditedVrioCampaignId = (() => window.VRIO?.campaignId)();
    const vrioCampaignId = auditedVrioCampaignId ?? campaignBasedOnBillingModel.externalId;
    const countries = campaignBasedOnBillingModel.metadata.countries;
    const integrationId = vrioIntegration?._id.toString();
    const currency = (campaignBasedOnBillingModel.currency || "USD").toLowerCase();

    return {
      vrioCampaignId,
      countries,
      integrationId,
      currency,
    };
  };

;
const isVipUpsell = true;
const { vrioCampaignId, countries, integrationId } = getVrioCampaignInfoBasedOnPaymentMethod(isVipUpsell);
const CURRENCY = "EUR";

const CURRENCY_LOCALE_MAP = {
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  AUD: 'en-AU',
};
const LOCALE = getLocaleFromCurrency(CURRENCY);

function getLocaleFromCurrency(currencyCode) {
  const code = (currencyCode || '').toUpperCase();
  if (code && CURRENCY_LOCALE_MAP[code]) return CURRENCY_LOCALE_MAP[code];
  return navigator.language || 'en-US';
};

function formatPrice(amount, suffix = '') {
  const formatted = new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formatted}${suffix}`;
};


const i18n = {
  "iso2": "DE",
  "phoneInitialCountry": "de",
  "dateFormat": "DD.MM.YYYY",
  "fallbackCountry": {
    "iso_numeric": 276,
    "calling_code": "49",
    "id": 79,
    "name": "Germany",
    "iso_2": "DE",
    "iso_3": "DEU"
  },
  "pricingText": {
    "off": "RABATT",
    "free": "KOSTENLOS",
    "freeShipping": "Kostenloser Versand",
    "perUnit": "/Stk.",
    "selectedProduct": "Ausgewähltes Produkt"
  },
  "validation": {
    "expirationDateRequired": "* Das Ablaufdatum ist erforderlich",
    "expirationDateInvalid": "* Ungültiges oder abgelaufenes Datum",
    "cardNumberRequired": "* Bitte geben Sie eine gültige Kartennummer ein",
    "cardNumberInvalid": "* Ungültige Kartennummer",
    "cardCvvRequired": "* Die Kartenprüfnummer (CVV) ist erforderlich",
    "cardCvvMinLength": "* Karten-CVV muss mindestens 3 Ziffern haben",
    "emailRequired": "* Bitte geben Sie eine E-Mail-Adresse ein",
    "emailInvalid": "* E-Mail ist ungültig!",
    "firstNameRequired": "* Der Vorname ist erforderlich",
    "lastNameRequired": "* Der Nachname ist erforderlich",
    "invalidCharacter": "* Enthält ein ungültiges Zeichen",
    "shippingAddressRequired": "* Die Lieferadresse ist erforderlich",
    "cityRequired": "* Der Ort ist erforderlich",
    "countryRequired": "* Das Land ist erforderlich",
    "stateRequired": "* Das Bundesland ist erforderlich",
    "zipRequired": "* Die Postleitzahl ist erforderlich",
    "zipInvalid": "* Ungültige Postleitzahl",
    "phoneInvalid": "* Die Telefonnummer ist erforderlich",
    "maxLength255": "* Maximal 255 Zeichen",
    "billingAddressRequired": "* Die Rechnungsadresse ist erforderlich",
    "billingCityRequired": "* Die Rechnungsstadt ist erforderlich",
    "billingZipRequired": "* Die Rechnungs-Postleitzahl ist erforderlich"
  },
  "errors": {
    "walletVerificationFailed": "Diese Zahlung erfordert eine zusätzliche Überprüfung. Bitte versuchen Sie eine andere Zahlungsmethode.",
    "walletOrderFailed": "Beim Erstellen Ihrer Bestellung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut",
    "unexpectedError": "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
    "paymentDeclined": "Ihre Zahlung konnte nicht verarbeitet werden. Bitte versuchen Sie eine andere Zahlungsmethode.",
    "systemErrorOffer": "Es gab ein Problem mit diesem Angebot. Bitte kontaktieren Sie den Support oder versuchen Sie es später erneut.",
    "systemErrorGeneric": "Bei der Verarbeitung Ihrer Bestellung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.",
    "klarnaNotAvailableRecurring": "Klarna ist für wiederkehrende Produkte nicht verfügbar.",
    "klarnaSubscriptionsNotSupported": "Abonnements werden mit Klarna nicht unterstützt",
    "klarnaOrderFailed": "Beim Erstellen der Bestellung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut",
    "klarnaProcessingFailed": "Bei der Verarbeitung Ihrer Bestellung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut",
    "klarnaPaymentNotCompleted": "Die Klarna-Zahlung wurde nicht abgeschlossen",
    "klarnaPaymentNotCompletedRedirect": "Die Klarna-Zahlung wurde nicht abgeschlossen. Weiterleitung zur Kasse...",
    "klarnaCompletionFailed": "Beim Abschließen Ihrer Klarna-Zahlung ist ein Fehler aufgetreten.",
    "orderAlreadyCompleteRedirect": "Bestellung ist bereits abgeschlossen. Weiterleitung zur nächsten Seite...",
    "unexpectedErrorRedirect": "Ein unerwarteter Fehler ist aufgetreten. Weiterleitung zur Kasse...",
    "orderNotFoundRedirect": "Bestellung nicht gefunden. Weiterleitung zur Kasse...",
    "orderNotFound": "Bestellung nicht gefunden. Bitte versuchen Sie es erneut.",
    "orderCanceled": "Bestellung storniert",
    "creditCardOrderFailed": "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut",
    "upsellOrderFailed": "Beim Hinzufügen der Angebote ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut",
    "countryNotAvailableNamed": "Das Land {name} ist nicht verfügbar, bitte wählen Sie ein anderes.",
    "countryNotAvailable": "Dieses Land ist nicht verfügbar, bitte wählen Sie ein anderes."
  },
  "labels": {
    "noStatesAvailable": "Keine Bundesländer für dieses Land verfügbar",
    "selectState": "Bundesland auswählen",
    "phoneSearchPlaceholder": "Suchen",
    "processing": "Wird verarbeitet...",
    "close": "Schließen",
    "cvvModalTitle": "Wo befindet sich mein Sicherheitscode?",
    "cvvCardBack": "Rückseite der Karte",
    "cvvCardFront": "Vorderseite der Karte",
    "cvvThreeDigitLabel": "3-stellige CVV-Nummer",
    "cvvFourDigitLabel": "4-stellige CVV-Nummer",
    "cvvBackDescription": "Der 3-stellige Sicherheitscode (CVV) befindet sich auf der Rückseite Ihrer Karte, rechts neben dem Unterschriftsstreifen.",
    "cvvFrontDescription": "American-Express-Karten haben einen 4-stelligen Code auf der Vorderseite."
  }
};

// Validation patterns (RegExp – cannot be serialised as JSON)
i18n.validationPatterns = {
  zipCodeRegex: /^(?:\d{5}(?:-\d{4})?|[A-Za-z]\d[A-Za-z](?:[ -]?\d[A-Za-z]\d)?|\d{4}|[A-Za-z]{1,2}\d[A-Za-z\d]?\s?\d[ABD-HJLN-UW-Z]{2})$/,
  nameRegex: /\b([A-ZÀ-ÿ][-,a-zÀ-ÿ. ']+[ ]*)+$/i,
};

i18n.phoneValidator = function (phone) {
        const normalized = phone.replace(/[\s\-()]/g, '');
        const regex = /^(\d{2,4})(\d{4,9})$/;
        return regex.test(normalized);
    };
function formatDateByConvention(year, month, day) {
  return `${day}.${month}.${year}`;
}


const PAYMENT_METHODS_IDS = {"creditCard":1,"googlePay":3,"applePay":4,"paypal":6,"klarna":12};
const CAMPAIGN_ID = vrioCampaignId;
const INTEGRATION_ID = integrationId;
const UPSELL_NEXT_PAGE_SLUG = "2/order/de/eu/upsell1b";

function getNextPageSlugForRedirect() {
  const normalize = (value) => {
    if (!value) return "";
    return value.startsWith("/69fe4e4ba709c6f249d61971-preview") ? value : (value.startsWith("/") ? "/69fe4e4ba709c6f249d61971-preview" + value : "/69fe4e4ba709c6f249d61971-preview/" + value);
  };
  if (UPSELL_NEXT_PAGE_SLUG) return normalize(UPSELL_NEXT_PAGE_SLUG);
  return "/";
}
const HAS_FOLLOWING_UPSELLS = true;
const UPSELL_WALLETS_CONFIG = {"enabled":false,"enableApplePay":false,"enableGooglePay":false,"enableKlarna":false};
const isKlarnaSelected = ({ walletsConfig } = {}) => {
  if (walletsConfig && typeof walletsConfig === "object") {
    if (!(walletsConfig.enabled && walletsConfig.enableKlarna)) return false;
  } else {
    try {
      const stored = sessionStorage.getItem("isKlarnaEnabled");
      if (stored !== null && JSON.parse(stored) !== true) return false;
    } catch {}
  }
  try {
    const orderData = JSON.parse(sessionStorage.getItem("orderData"));
    return Number(orderData?.payment_method_id) === 12;
  } catch {
    return false;
  }
};
const isKlarnaPayment = isKlarnaSelected({ walletsConfig: UPSELL_WALLETS_CONFIG });
const removeKlarnaParamsFromUrl = (urlValue) => {
  const sourceUrl = urlValue || window.location.href;
  const url = new URL(sourceUrl, window.location.origin);
  url.searchParams.delete("payment_intent");
  url.searchParams.delete("payment_intent_client_secret");
  url.searchParams.delete("redirect_status");
  return url.toString();
};

const applyKlarnaVisibility = () => {
  
  const setKlarnaElementVisibility = (element, shouldHide) => {
    if (!element) return;
    if (shouldHide) {
      element.style.setProperty("display", "none", "important");
      element.setAttribute("aria-hidden", "true");
    } else {
      element.style.removeProperty("display");
      element.setAttribute("aria-hidden", "false");
    }
  };
  let hiddenKlarnaTargetsCount = 0;
  document
    .querySelectorAll("[data-hide-on-klarna]")
    .forEach((element) => {
      if (isKlarnaPayment) hiddenKlarnaTargetsCount += 1;
      setKlarnaElementVisibility(element, isKlarnaPayment);
    });
  document
    .querySelectorAll("[data-show-on-klarna]")
    .forEach((element) => setKlarnaElementVisibility(element, !isKlarnaPayment));
  

};

let selectedProduct;
const AUTO_SKIP_SCREEN_ID = "autoskip-screen";

const getOrCreateVipAutoSkipScreen = () => {
  let screen = document.getElementById(AUTO_SKIP_SCREEN_ID);
  if (screen) return screen;

  if (!document.getElementById("autoskip-screen-keyframes")) {
    const style = document.createElement("style");
    style.id = "autoskip-screen-keyframes";
    style.textContent =
      "@keyframes autoskipScreenRotation {0% {transform: rotate(0deg);}100% {transform: rotate(360deg);}}";
    document.head.appendChild(style);
  }

  screen = document.createElement("div");
  screen.id = AUTO_SKIP_SCREEN_ID;
  screen.setAttribute("aria-live", "polite");
  screen.setAttribute("data-testid", "autoskip-screen");
  screen.style.position = "fixed";
  screen.style.inset = "0";
  screen.style.zIndex = "9000";
  screen.style.background = "#ffff";
  screen.style.display = "none";
  screen.style.alignItems = "center";
  screen.style.justifyContent = "center";

  const spinner = document.createElement("div");
  spinner.className = "loader";
  spinner.setAttribute("data-testid", "autoskip-spinner");
  spinner.style.width = "48px";
  spinner.style.height = "48px";
  spinner.style.borderRadius = "50%";
  spinner.style.display = "inline-block";
  spinner.style.boxSizing = "border-box";
  spinner.style.animation = "autoskipScreenRotation 1s linear infinite";
  spinner.style.marginTop = "22px";
  spinner.style.border = "5px solid rgba(18, 76, 117, 1.00)";
  spinner.style.borderBottomColor = "transparent";

  const spacer = document.createElement("span");
  spacer.innerHTML = "<br>";
  spinner.appendChild(spacer);
  screen.appendChild(spinner);
  document.body.appendChild(screen);

  return screen;
};

const getPrices = async function upsellGetPrices(allPrices) {
  const productId = document.querySelector('[data-product-id]').getAttribute('data-product-id');
  selectedProduct = allPrices.find((price) => price.id === Number(productId));

  const currencyClass = document.querySelectorAll('[data-holder="currency"]');
  currencyClass.forEach((el) => {
    el.innerHTML = "$";
  });

  const priceClass = document.querySelectorAll('[data-holder="product_full_price"]');
  priceClass.forEach((el) => {
    el.innerHTML = selectedProduct.finalPrice;
  });

  const discountClass = document.querySelectorAll('[data-holder="product_discount_percentage"]');
  discountClass.forEach((el) => {
    el.innerHTML = selectedProduct.discountPercentage;
  });

  return selectedProduct;
};
const prices = [{"name":"VIP Customer Benefits","id":26,"quantity":1,"price":24.99,"shippable":false,"fullPrice":24.99,"finalPrice":24.99,"productName":"VIP Customer Benefits","discountAmount":0,"discountPercentage":0},{"name":"1x Vital Shoulder Massager","id":1936,"quantity":1,"price":0,"shippable":false,"fullPrice":0,"finalPrice":0,"productName":"1x Vital Shoulder Massager","discountAmount":0,"discountPercentage":0},{"name":"2x Vital Shoulder Massager","id":1937,"quantity":1,"price":0,"shippable":false,"fullPrice":0,"finalPrice":0,"productName":"2x Vital Shoulder Massager","discountAmount":0,"discountPercentage":0},{"name":"3x Vital Shoulder Massager","id":1938,"quantity":1,"price":0,"shippable":false,"fullPrice":0,"finalPrice":0,"productName":"3x Vital Shoulder Massager","discountAmount":0,"discountPercentage":0},{"name":"4x Vital Shoulder Massager","id":1939,"quantity":1,"price":0,"shippable":false,"fullPrice":0,"finalPrice":0,"productName":"4x Vital Shoulder Massager","discountAmount":0,"discountPercentage":0},{"name":"Porch Pirate - Guarantee","id":2052,"quantity":1,"price":0,"shippable":false,"fullPrice":0,"finalPrice":0,"productName":"Porch Pirate - Guarantee","discountAmount":0,"discountPercentage":0},{"name":"Special 1x EXTRA Vital Shoulder Massager","id":1942,"quantity":1,"price":0,"shippable":false,"fullPrice":0,"finalPrice":0,"productName":"Special 1x EXTRA Vital Shoulder Massager","discountAmount":0,"discountPercentage":0},{"name":"Special 1x EXTRA Vital Shoulder Massager","id":1943,"quantity":1,"price":0,"shippable":false,"fullPrice":0,"finalPrice":0,"productName":"Special 1x EXTRA Vital Shoulder Massager","discountAmount":0,"discountPercentage":0},{"name":"Vital Shoulder Massager   Journey Package Protection","id":1941,"quantity":1,"price":0,"shippable":false,"fullPrice":0,"finalPrice":0,"productName":"Vital Shoulder Massager   Journey Package Protection","discountAmount":0,"discountPercentage":0},{"name":"Vital Shoulder Massager - 3 Year Warranty","id":1940,"quantity":1,"price":0,"shippable":false,"fullPrice":0,"finalPrice":0,"productName":"Vital Shoulder Massager - 3 Year Warranty","discountAmount":0,"discountPercentage":0}];
const shippables = [{"id":1935,"name":"Vital Shoulder Massager"}];

function removeObjectUndefinedProperties(obj) {
  for (const key in obj) {
    if (obj[key] === undefined || obj[key] === null || obj[key] === "")
      delete obj[key];
  }
  return obj;
}
const createCart = async (sanitizedOrderData) => {
    let cartResponse = await fetch(
    `https://app-cms-api-proxy-prod-001.azurewebsites.net/vrio/carts`,
    {
      method: 'POST',
      headers: {
        authorization: `appkey ${INTEGRATION_ID}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        offers: sanitizedOrderData.offers,
        campaign_id: CAMPAIGN_ID,
        connection_id: sanitizedOrderData.connection_id,
        pageId: sanitizedOrderData.pageId,
      }),
      keepalive: false,
    }
  );
  if (cartResponse.status === 200) {
    cartResponse = await cartResponse.json();
    sessionStorage.setItem('cart_token', cartResponse.cart_token);
    return cartResponse.cart_token;
  }
};
const getProductElement = (productId) => {
  const productElement = document.querySelector(`[data-product-id="${productId}"]`);
  if (productElement) {
    return productElement;
  } else {
    throw new Error(`Product element with ID ${productId} not found.`);
  }
};;
const flagOrderAsTest = async (orderId) => {
  if (!orderId) return null;
  try {
    const res = await fetch(
      `https://app-cms-api-proxy-prod-001.azurewebsites.net/vrio/orders/${orderId}`,
      {
        method: "PATCH",
        headers: {
          authorization: `appkey ${INTEGRATION_ID}`,
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({ is_test: true })
      }
    );
    return await res.json();
  } catch (_) {
    return null;
  }
}
const getBindedShippableProductAndQuantity = (productElement) => {
  if (productElement && productElement.dataset.shippableProductId) {
    const shippableId = Number(productElement.dataset.shippableProductId);
    let quantity = 1;
    if (!isNaN(productElement.dataset.productQuantity)) {
      quantity = Number(productElement.dataset.productQuantity);
    } else if (!isNaN(Number(productElement.value))) {
      quantity = Number(productElement.value);
    }
    return { product: shippables.find((s) => s.id === shippableId), quantity };
  }
  return null;
};;
const productCustomData = JSON.parse(sessionStorage.getItem("productCustomData")) || {};
const saveProductCustomData = (productElement) => {
  productCustomData[productElement.dataset.productId] = {
    customProductName: productElement.dataset.customProductName,
    customSummaryRow: productElement.dataset.customSummaryRow,
    customIsGift: productElement.dataset.customIsGift,
  };
}
const getVrioOfferIdByProductId = (productId) => {
    const vrioOffers = [{"id":296,"offerTypeId":2,"name":"Vital Shoulder Massager - VIP","items":[{"name":"VIP Customer Benefits","id":26,"quantity":1,"price":24.99,"shippable":false}]},{"id":295,"offerTypeId":1,"name":"Vital Shoulder Massager - Network","items":[{"name":"1x Vital Shoulder Massager","id":1936,"quantity":1,"price":0,"shippable":false},{"name":"2x Vital Shoulder Massager","id":1937,"quantity":1,"price":0,"shippable":false},{"name":"3x Vital Shoulder Massager","id":1938,"quantity":1,"price":0,"shippable":false},{"name":"4x Vital Shoulder Massager","id":1939,"quantity":1,"price":0,"shippable":false},{"name":"Porch Pirate - Guarantee","id":2052,"quantity":1,"price":0,"shippable":false},{"name":"Special 1x EXTRA Vital Shoulder Massager","id":1942,"quantity":1,"price":0,"shippable":false},{"name":"Special 1x EXTRA Vital Shoulder Massager","id":1943,"quantity":1,"price":0,"shippable":false},{"name":"Vital Shoulder Massager","id":1935,"quantity":1,"price":0,"shippable":true},{"name":"Vital Shoulder Massager   Journey Package Protection","id":1941,"quantity":1,"price":0,"shippable":false},{"name":"Vital Shoulder Massager - 3 Year Warranty","id":1940,"quantity":1,"price":0,"shippable":false}]}];
    const recurringOfferTypeIds = [2, '2'];
    let matchedOffer = null;
    let isRecurringOffer = false;

    // prefer recurring offer match, fallback to first non-recurring match
    for (const offer of vrioOffers) {
      if (offer.items.some((item) => String(item.id) === String(productId))) {
        if (recurringOfferTypeIds.includes(offer.offerTypeId)) {
          matchedOffer = offer;
          isRecurringOffer = true;
          break;
        }
        if (!matchedOffer) matchedOffer = offer;
      }
    }

    return {
      offerId: matchedOffer?.id,
      isRecurringOffer,
    };
  };
const showToast = function(message, bg = "#333") {
  const container =
    document.querySelector("#toast-container") ||
    (() => {
      const div = document.createElement("div");
      div.id = "toast-container";
      div.setAttribute("data-testid", "toast-container");
      div.style.position = "fixed";
      div.style.top = "10px";
      div.style.right = "10px";
      div.style.zIndex = "9999";
      document.body.appendChild(div);
      return div;
    })();

  const toast = document.createElement("div");
  toast.className = "mytoast";
  toast.setAttribute("data-testid", "toast");
  toast.textContent = message;
  toast.style.background = bg;
  toast.style.color = "#fff";
  toast.style.padding = "10px 15px";
  toast.style.marginTop = "5px";
  toast.style.borderRadius = "5px";
  toast.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3500);
}

const getUpsellSessionData = () => {
  const orderData = JSON.parse(sessionStorage.getItem("orderData"));
  const lastOrderId = sessionStorage.getItem("cms_oid");
  const addressData = JSON.parse(sessionStorage.getItem("addressData"));
  const offerIdFromOrderData = orderData.offers[0].offer_id;
  return { orderData, lastOrderId, addressData, offerIdFromOrderData };
};

const getUniqueSelectedProductIds = () => {
  const productIds = Array.from(document.querySelectorAll("[data-product-id]:not([data-product-card])"))
    .map((el) => Number(el.getAttribute("data-product-id")))
    .filter((value) => !isNaN(value));
  const selectedProducts = prices.filter((price) =>
    productIds.includes(price.id)
  );
  const productSelectedFromUI = document.querySelector(".product-card-active")?.getAttribute("data-product-id");
  if (productSelectedFromUI) {
    selectedProducts.push(prices.find((price) => price.id === Number(productSelectedFromUI)));
  }
  const uniqueSelectedProductIds = [...new Set(selectedProducts.map((product) => product.id))];
  if (uniqueSelectedProductIds.length === 0) {
    throw new Error("Missing product configuration/binding");
  }
  return uniqueSelectedProductIds;
};

const isRecurringProduct = (productId) => {
  const offerData = getVrioOfferIdByProductId(productId);
  return Boolean(offerData?.isRecurringOffer);
};

function getParams() {
  let queryString = window.location.search;

  if (
    (!queryString || queryString === "") &&
    window.location.hash.includes("?")
  ) {
    const hashPart = window.location.hash.split("?")[1];
    queryString = "?" + hashPart;
  }

  return new URLSearchParams(queryString);
}

function setUpsellButtonsDisabled(isDisabled) {
  const actionButtons = document.querySelectorAll(
    "[data-submit-button], [data-decline-button]"
  );
  actionButtons.forEach((button) => {
    if (isDisabled) {
      button.setAttribute("disabled", "disabled");
      button.style.pointerEvents = "none";
      return;
    }
    button.removeAttribute("disabled");
    button.style.pointerEvents = "";
  });
}

function isOrderAlreadyCompletedError(err) {
  const code = err?.error?.code || err?.code;
  const message = (err?.error?.message || err?.message || "").toLowerCase();
  return (
    code === "order_already_completed" ||
    message.includes("order is already complete")
  );
}

function showErrorAndRedirect(msg, redirectTarget = "checkout") {
  const checkoutUrl = sessionStorage.getItem("checkoutUrl") || "/";
  const nextPageUrl = getNextPageSlugForRedirect();

  let targetUrl = redirectTarget === "nextPage" ? nextPageUrl : checkoutUrl;
  if (redirectTarget !== "nextPage" && targetUrl) {
    try {
      const url = new URL(checkoutUrl);
      url.searchParams.set("error", msg);
      targetUrl = url.toString();
    } catch (error) {
      console.error("Error setting error parameter in URL", error);
    }
  }

  const errorEl = document.querySelector("[data-general-error]");
  const isAutoSkipScreenVisible =
    document.getElementById(AUTO_SKIP_SCREEN_ID)?.style.display === "flex" ?? false;
  if (isAutoSkipScreenVisible || !errorEl) {
    showToast(msg);
  } else {
    errorEl.innerText = msg;
    errorEl.style.display = "block";
  }
  if (targetUrl) {
    setUpsellButtonsDisabled(true);
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 5000);
  }
}

const runDeclineFlow = async ({ isAutoSkip = false } = {}) => {
  if (!isAutoSkip) {
   MVMT.track("CTA_CLICK", {
    page: "VSM - Upsell1a DE",
    page_type: "Upsell",
    page_url: window.location.href
  });
  }

  if (isKlarnaPayment && !HAS_FOLLOWING_UPSELLS && typeof declineKlarnaUpsell === "function") {
    await declineKlarnaUpsell();
    return;
  }

  window.location.href = getNextPageSlugForRedirect();
};



const processKlarnaUpsell = async () => {
  if (!isKlarnaPayment) {
    throw new Error("Klarna is not available");
  }
  setUpsellButtonsDisabled(true);

  const preload = document.querySelector("[data-preloader]");
  if (preload) preload.style.display = "flex";
  const errorEl = document.querySelector("[data-general-error]");
  if (errorEl) {
    errorEl.style.display = "none";
    errorEl.innerText = "";
  }
  try {
    const { orderData, lastOrderId, offerIdFromOrderData } =
      getUpsellSessionData();

    if (!lastOrderId) {
      throw new Error("No order ID found in session");
    }

    // Build offers to add via API (each offer gets a unique id to force new entries)
    const offers = [];

    const uniqueSelectedProductIds = getUniqueSelectedProductIds();
    uniqueSelectedProductIds.forEach((selectedProductId) => {
      const selectedProductOfferData = getVrioOfferIdByProductId(selectedProductId);
      if (selectedProductOfferData?.isRecurringOffer) {
        return;
      }
      const selectedProductOfferId =
        selectedProductOfferData.offerId ?? offerIdFromOrderData;
      const isVipProduct = Boolean(
        isVipUpsell && selectedProductOfferData.isRecurringOffer
      );
      offers.push({
        id: crypto.randomUUID(),
        offer_id: selectedProductOfferId,
        order_offer_quantity: 1,
        item_id: selectedProductId,
        order_offer_upsell: true,
        parent_offer_id: offerIdFromOrderData,
        ...(isVipProduct ? { order_offer_price: "0.00" } : {})
      });

      const productElement = getProductElement(selectedProductId);
      saveProductCustomData(productElement);
      let { product, quantity } =
        getBindedShippableProductAndQuantity(productElement) ?? {};
      if (product) {
        const bindedProductOfferData = getVrioOfferIdByProductId(product.id);
        if (bindedProductOfferData?.isRecurringOffer) {
          return;
        }
        const bindedProductOfferId =
          bindedProductOfferData.offerId ?? selectedProductOfferId;
        offers.push({
          id: crypto.randomUUID(),
          offer_id: bindedProductOfferId,
          order_offer_upsell: true,
          parent_offer_id: offerIdFromOrderData,
          item_id: product.id,
          order_offer_quantity: quantity
        });
      }
    });

    if (offers.length === 0) {
      throw new Error(i18n.errors.klarnaNotAvailableRecurring);
    }

    if (isTest)
      console.log("Klarna: adding upsell offers via /order_offers", {
        order_id: lastOrderId,
        offers
      });

    MVMT.track("UPSELL_SUBMITTED", {
      page: "VSM - Upsell1a DE",
      page_type: "Upsell",
      page_url: window.location.href,
      order_id: lastOrderId,
      offers
    });
    MVMT.track("CTA_CLICK", {
      page: "VSM - Upsell1a DE",
      page_type: "Upsell",
      page_url: window.location.href
    });

    // Add offers to existing order via API
    const response = await fetch(
      `https://app-cms-api-proxy-prod-001.azurewebsites.net/vrio/order_offers`,
      {
        method: "POST",
        headers: {
          authorization: `appkey ${INTEGRATION_ID}`,
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
          offers: offers.map((o) => JSON.stringify(o)),
          order_id: lastOrderId,
          pageId: "XJe_kXk8CDDWbQjmcD-p12P372nTe3S7rPcRFqWwd0IOhPV_fnTKKrysEZmVNY9d"
        })
      }
    );

    const result = await response.json();

    if (isTest) console.log("Klarna order_offers response:", result);

    if (!response.ok) {
      const msg =
        (result && result.error && result.error.message) ||
        (result && result.message) ||
        i18n.errors.upsellOrderFailed;
      throw new Error(msg);
    }

    const newOrderData = {
      ...orderData,
      offers: [...(orderData.offers || []), ...offers]
    };
    const orderids = JSON.parse(sessionStorage.getItem("orderids")) || [];
    if (!orderids.includes(lastOrderId)) {
      sessionStorage.setItem("orderids", JSON.stringify([...orderids, lastOrderId]));
    }
    sessionStorage.setItem("cms_oid", String(lastOrderId));
    const orderSummaryData = JSON.parse(sessionStorage.getItem("orderSummary")) || [];
    orderSummaryData.push({
      order_id: lastOrderId,
      order_offers: offers,
      source: "klarna_upsell_order_offers"
    });
    sessionStorage.setItem("orderSummary", JSON.stringify(orderSummaryData));
    sessionStorage.setItem("orderData", JSON.stringify(newOrderData));
    sessionStorage.setItem(
      "productCustomData",
      JSON.stringify(productCustomData)
    );

    if (!HAS_FOLLOWING_UPSELLS && typeof processAndRedirectToKlarna === "function") {
    await processAndRedirectToKlarna(lastOrderId, removeKlarnaParamsFromUrl());
    } else {
      window.location.href = getNextPageSlugForRedirect();
    }
  } catch (error) {
    console.error(error);
    if (isOrderAlreadyCompletedError(error)) {
      showErrorAndRedirect(
        error?.message ||
          i18n.errors.orderAlreadyCompleteRedirect,
        "nextPage"
      );
      return;
    }
    if (errorEl) {
      errorEl.innerText =
        error?.message || i18n.errors.unexpectedError;
      errorEl.style.display = "block";
    } else {
      showToast(error?.message || i18n.errors.unexpectedError);
    }

  } finally {
    if (preload) preload.style.display = "none";
    setUpsellButtonsDisabled(false);
  }
};

const processUpsell = async () => {
  setUpsellButtonsDisabled(true);
  
  const preload = document.querySelector("[data-preloader]");
  if (preload) preload.style.display = "flex";
  const errorEl = document.querySelector("[data-general-error]");
  if (errorEl) {
    errorEl.style.display = "none";
    errorEl.innerText = "";
  }
  try {
    const orderData = JSON.parse(sessionStorage.getItem("orderData"));
    orderData.pageId = "XJe_kXk8CDDWbQjmcD-p12P372nTe3S7rPcRFqWwd0IOhPV_fnTKKrysEZmVNY9d";
    const lastOrderId = sessionStorage.getItem("cms_oid");
    const stripePayment = JSON.parse(sessionStorage.getItem("stripePayment"));
    const isStripeTestOrder = stripePayment && !stripePayment.isLive;
    const orderSummaryData =
      JSON.parse(sessionStorage.getItem("orderSummary")) || [];
    const customerCardId =
      orderSummaryData[0]?.order?.customer_card_id ||
      orderSummaryData[0]?.customer_card_id;
    const cartToken = await createCart(orderData);
    const offerIdFromOrderData = orderData.offers?.[0]?.offer_id;
    let shippingProfileId;
    orderData.offers = [];

    const uniqueSelectedProductIds = getUniqueSelectedProductIds();
    uniqueSelectedProductIds.forEach( (selectedProductId) => {
      const selectedProductOfferData = getVrioOfferIdByProductId(selectedProductId);
      const selectedProductOfferId =
        selectedProductOfferData.offerId ?? offerIdFromOrderData;
      const isVipProduct = Boolean(
        isVipUpsell &&
          selectedProductOfferData.isRecurringOffer,
      );
      orderData.offers.push({
          offer_id: selectedProductOfferId,
          order_offer_quantity: 1,
          item_id: selectedProductId,

          order_offer_upsell: true,
          parent_offer_id: offerIdFromOrderData,
          parent_order_id: lastOrderId,
          ...(isVipProduct ? { order_offer_price: "0.00" } : {})
      })

      const productElement = getProductElement((selectedProductId));
      saveProductCustomData(productElement);
      let { product, quantity } = getBindedShippableProductAndQuantity(productElement) ?? {};
      if (product) {
        shippingProfileId = +document.querySelector(`[data-shippable-product-id="${product.id}"]`)?.getAttribute('data-shipping-profile-id') || undefined;
        const bindedProductOfferData = getVrioOfferIdByProductId(product.id);
        const bindedProductOfferId =
          bindedProductOfferData.offerId ?? selectedProductOfferId;
        orderData.offers.push({
          offer_id: bindedProductOfferId,
          order_offer_upsell: true,
          parent_offer_id: offerIdFromOrderData,
          parent_order_id: lastOrderId,
          item_id: product.id,
          order_offer_quantity: quantity,
        });
      }
    })

    orderData.cart_token = cartToken;

    if (customerCardId) {
      orderData.customer_card_id = customerCardId;
    }

    sessionStorage.setItem("cart_token", cartToken);
    const addressData = JSON.parse(sessionStorage.getItem("addressData"));

    const sanitizedOrderData = removeObjectUndefinedProperties(!orderData.email ? {...orderData, ...addressData} : orderData);

    if (isTest) console.log("Sending upsell to VRIO", orderData);
    MVMT.track("UPSELL_SUBMITTED", {
      page: "VSM - Upsell1a DE",
      page_type: "Upsell",
      page_url: window.location.href,
      order_data: orderData,
    });

    const response = await fetch(
      `https://app-cms-api-proxy-prod-001.azurewebsites.net/vrio/orders`,
      {
        method: "POST",
        headers: {
          authorization: `appkey ${INTEGRATION_ID}`,
          "Content-Type": "application/json; charset=utf-8",
        },
            body: JSON.stringify({
          ...sanitizedOrderData,
          campaign_id: CAMPAIGN_ID,
          order_id: lastOrderId,
          shipping_profile_id: shippingProfileId,
          tracking12: window.location.href
        }),
      }
    );

    const result = await response.json();
    console.log(result);

    if (isStripeTestOrder && result.order_id) {
      await flagOrderAsTest(result.order_id);
    }

    if (stripePayment && result && result.response_code === 101) {
      if (errorEl) {
        errorEl.innerText =
          i18n.errors.walletVerificationFailed;
        errorEl.style.display = "block";
      }
      if (window.MVMT) {
        MVMT.track("UPSELL_ERROR", {
          page: "VSM - Upsell1a DE",
          page_type: "Upsell",
          page_url: window.location.href,
          order_data: orderData
        });
      }
      return;
    }

    if (!response.ok || (result && result.error) || !result.order_id) {
      console.error("Something went wrong");
      if (preload) preload.style.display = "none";
      const msg =
        (result && result.error && result.error.message) ||
        (result && result.message) ||
        i18n.errors.walletOrderFailed;

      if (errorEl) {
        errorEl.innerText = msg;
        errorEl.style.display = "block";
      } else {
        showToast(msg);
      }
      MVMT.track("UPSELL_ERROR", {
        page: "VSM - Upsell1a DE",
        page_type: "Upsell",
        page_url: window.location.href,
        order_data: orderData,
      });
      return;
    }

    MVMT.track("UPSELL_SUCCESS", {
      page: "VSM - Upsell1a DE",
      page_type: "Upsell",
      page_url: window.location.href,
      order_data: orderData,
    });
    MVMT.track("CTA_CLICK", {
      page: "VSM - Upsell1a DE",
      page_type: "Upsell",
      page_url: window.location.href,
    });

    if (isTest) console.log(result);

    const orderDataSummary = JSON.parse(sessionStorage.getItem("orderSummary")) || [];
    orderDataSummary.push(result);
    sessionStorage.setItem("orderSummary", JSON.stringify(orderDataSummary));

    sessionStorage.setItem("cms_oid", result.order_id);
    sessionStorage.setItem("orderData", JSON.stringify(sanitizedOrderData));
    const orderids = JSON.parse(sessionStorage.getItem("orderids")) || [];
    sessionStorage.setItem("orderids", JSON.stringify([...orderids, result.order_id]));
    sessionStorage.setItem("productCustomData", JSON.stringify(productCustomData));

    const paymentMethodId = sanitizedOrderData.payment_method_id;

    const paymentMethodNames = {
      [PAYMENT_METHODS_IDS.creditCard]: "creditCard",
      [PAYMENT_METHODS_IDS.googlePay]: "Google Pay",
      [PAYMENT_METHODS_IDS.applePay]: "Apple Pay",
      [PAYMENT_METHODS_IDS.paypal]: "PayPal",
      [PAYMENT_METHODS_IDS.klarna]: "Klarna"
    };

    const paymentMethodName = paymentMethodNames[paymentMethodId] || paymentMethodNames[PAYMENT_METHODS_IDS.creditCard];
    
    sendTransactionToDataLayer(vrioToTransaction(result), paymentMethodName);

    try {
      if (typeof sendKlaviyoOrderEvents === 'function') {
        await sendKlaviyoOrderEvents(sanitizedOrderData, result);
      }
    } catch (error) {
      console.error("Error sending order events to Klaviyo", error);
    }

    window.location.href = getNextPageSlugForRedirect();
  } catch (error) {
    console.error(error);
    if (errorEl) {
      errorEl.innerText = i18n.errors.unexpectedError;
      errorEl.style.display = "block";
    } else {
      showToast(i18n.errors.unexpectedError);
    }
  } finally {
    if (preload) preload.style.display = "none";
    setUpsellButtonsDisabled(false);
  }
};

const areAllProductsRecurring = () => {
  const pageProductIds = getUniqueSelectedProductIds();
  return pageProductIds.length > 0 && pageProductIds.every((productId) => isRecurringProduct(productId));
}



document.addEventListener("DOMContentLoaded", async () => {
  
(function ensurePreloaderExists() {
    const existing = document.querySelector('[data-preloader]');
    if (existing) {
        if (!existing.getAttribute('data-testid')) {
            existing.setAttribute('data-testid', 'preloader');
        }
        const spinner = existing.querySelector('.loader');
        if (spinner && !spinner.getAttribute('data-testid')) {
            spinner.setAttribute('data-testid', 'preloader-spinner');
        }
        return;
    }
    const loaderOverlay = document.createElement('div');
    loaderOverlay.setAttribute('data-preloader', '');
    loaderOverlay.setAttribute('data-testid', 'preloader');
    loaderOverlay.innerHTML = `
        <div class="loader" data-testid="preloader-spinner"></div>
        <p>${i18n.labels.processing}</p>
    `;

    const loaderStyles = `
        [data-preloader] {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: none;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 8px;
            background: rgba(255, 255, 255, 0.3);
            z-index: 9999;
        }
        [data-preloader] .loader {
            width: 48px;
            height: 48px;
            border-bottom-color: transparent !important;
            border-radius: 50%;
            display: inline-block;
            box-sizing: border-box;
            animation: rotation 1s linear infinite;
            margin-top: 22px;
            border: 5px solid rgb(18, 76, 117);
        }

        @keyframes rotation {
            0% {
                transform: rotate(0deg);
            }

            100% {
                transform: rotate(360deg);
            }
        }
    `;
    document.head.insertAdjacentHTML('beforeend', `<style>${loaderStyles}</style>`);
    document.body.appendChild(loaderOverlay);
})();

  
if (typeof validateAndSendToKlaviyo === "function") {
  try {
    var klaviyoDebugEnabled = false;
    try {
      klaviyoDebugEnabled = typeof isKlaviyoDebugEnabled === "function"
        ? isKlaviyoDebugEnabled()
        : !!(typeof window !== "undefined" && window.__KLAVIYO_DEBUG__ === true);
    } catch (e) {}
    var pageReadyPayload = {
      id: "log_" + Date.now() + "_" + Math.random().toString(16).slice(2, 8),
      timestamp: Date.now(),
      location: "builder-events/upsell/vrio-upsell-js-generator.ts" + ":KlaviyoLifecycle:page_ready",
      message: "Klaviyo lifecycle: page ready",
      runId: "initial",
      hypothesisId: "KlaviyoLifecycle",
      data: { pageName: "VSM - Upsell1a DE", pageType: "Upsell" },
    };
    if (klaviyoDebugEnabled && typeof console !== "undefined" && console.log) {
      console.log("[Klaviyo lifecycle] page_ready " + JSON.stringify(pageReadyPayload.data));
    }
  } catch (e) {}
}

  const isKlarnaReturnFlow = Boolean(getParams().get("payment_intent"));
  const shouldAutoSkip = isKlarnaPayment && isVipUpsell && areAllProductsRecurring();
  if (shouldAutoSkip) {
    const screen = getOrCreateVipAutoSkipScreen();
    screen.style.display = "flex";
  }
  
  applyKlarnaVisibility();

  if (shouldAutoSkip && !isKlarnaReturnFlow) {
    try {
      await runDeclineFlow({ isAutoSkip: true });
      return;
    } catch (error) {
      console.error("Failed to auto-skip VIP recurring page", error);
      const screen = getOrCreateVipAutoSkipScreen();
      screen.style.display = "none";
    }
  }

  const upsellPrice = await getPrices(prices);

  const takeUpsellBtns = document.querySelectorAll("[data-submit-button]");
  const refuseUpsellBtns = document.querySelectorAll("[data-decline-button]");
  const selectableProductsFromUI = document.querySelectorAll("[data-product-card]");

  takeUpsellBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (isKlarnaPayment) {
        await processKlarnaUpsell();
      } else {
        await processUpsell();
      }
    });
  });
  refuseUpsellBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      await runDeclineFlow();
    });
  });
  selectableProductsFromUI?.forEach((productEl) => {
    productEl.addEventListener("click", () => {
      selectableProductsFromUI.forEach((productEl) => {
        productEl.classList.remove("product-card-active");
      });
      productEl.classList.add("product-card-active");
    });
  });
});
const vrioToTransaction = (orderResult) => {
  return {
    orderId: orderResult.order_id.toString(),
    customerId: orderResult.customer_id || orderResult.customerId,
    subtotal: orderResult.order.cart?.subtotal,
    tax: orderResult.order.cart?.total_tax,
    shippingAmount: orderResult.order.cart?.total_shipping,
    shippingMethod: orderResult.order.cart?.order.shipping_profile_id,
    total: orderResult.order.cart?.total,
    grandTotal: orderResult.order.cart?.total,
    isTestOrder: orderResult.order.is_test,
    line_items: orderResult.order.cart.offers.map((item) => {
      return {
        product_id: item.item_id,
        productName: item.item_name,
        quantity: item.order_offer_quantity,
        discount: item.discount,
        discountCode: item.discount_code,
        price: Number(item.total)
      }
    }),
    discountAmount: Number(orderResult.order.cart?.total_discount) || 0,
    couponCode: orderResult.order.cart?.order.discount_code || '',
  }
};;
const sendTransactionToDataLayer = (response, paymentOption) => {
  const details = Array.isArray(response) ? response.at(-1) : response;
  const customerId = details.customerId || details.customer_id;
  const address = JSON.parse(sessionStorage.getItem('addressData'));
  sessionStorage.setItem('customerId', customerId);
  const transaction = {
    event: 'transaction',
    offer: offerName,
    customer_id: details.customerId.toString(),
    page: {
      type: "Upsell",
      isReload: performance.getEntriesByType('navigation')[0].type === 'reload',
      isExclude: false,
    },
    order: {
      id: details.orderId.toString(),
      subtotal: parseFloat(details.subtotal),
      tax: parseFloat(details.tax),
      shippingAmount: parseFloat(details.shippingAmount),
      shippingMethod: details.shippingMethod,
      paymentMethod: paymentOption,
      total: parseFloat(details.total),
      grandTotal: parseFloat(details.grandTotal),
      count: 1,
      step: "Upsell",
      isTestOrder: isTest || details.isTestOrder,
      product: details.line_items
        .reduce((acc, curr) => {
          if (acc.find((item) => item.product_id === curr.product_id)) {
            curr.quantity += acc.find(
              (item) => item.product_id === curr.product_id
            ).quantity;
          }
          return [...acc, curr];
        }, [])
        .map((item) => {
          const p = prices.find((p) => p.id === +item.product_id);
          let qty = 1;
          const productEl = document.querySelector(
            `[data-product-id="${item.product_id}"]`
          );
          if (productEl) qty = Number(productEl.dataset.productQuantity) || 1;
          if (p) {
            return {
              type: offerName,
              name: p.productName,
              price: item.price,
              regprice: p.fullPrice,
              individualPrice: item.price / (qty * item.quantity),
              quantity: item.quantity,
              packageQuantity: qty,
              group: "upsell",
            };
          }
          const variant = shippables.find((s) => s.id === +item.product_id);
          if (variant) {
            return {
              type: offerName,
              name: variant.name,
              price: 0.00,
              regprice: 0.00,
              individualPrice: 0.00,
              quantity: item.quantity,
              packageQuantity: 1,
              group: "upsell",
            };
          }
        }),
    },
    customer: {
      billingInfo: {
        address1: address.billingAddress1 ?? address.bill_address1,
        address2: address.billingAddress2 ?? address.bill_address2,
        city: address.billingCity ?? address.bill_city,
        country: address.billingCountry ?? address.bill_country,
        state: address.billingState ?? address.bill_state,
        postalCode: address.billingZip ?? address.bill_zipcode,
      },
      shippingInfo: {
        firstName: address.firstName ?? address.ship_fname,
        lastName: address.lastName ?? address.ship_lname,
        address1: address.shippingAddress1 ?? address.ship_address1,
        address2: address.shippingAddress2 ?? address.ship_address2,
        city: address.shippingCity ?? address.ship_city,
        countryCode: address.shippingCountry ?? address.ship_country,
        state: address.shippingState ?? address.ship_state,
        postalCode: address.shippingZip ?? address.ship_zipcode,
        emailAddress: address.email,
        phoneNumber: address.phone,
      },
    },
  };
  if (Number(details.discountAmount) > 0) {
    transaction.order.couponCode = details.couponCode;
  } else {
    transaction.order.couponCode = '';
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(transaction);
};
  
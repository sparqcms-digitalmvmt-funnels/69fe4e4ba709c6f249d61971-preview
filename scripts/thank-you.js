


const EMAIL_OVERSIGHT_VALIDATE_URL = 'https://app-cms-api-proxy-prod-001.azurewebsites.net/integration/email-oversight/validate-public';





// Select campaign based on whether this is a VIP page or not
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
// For thank you without upsell, use non-VIP campaign
const campaignInfo = getVrioCampaignInfoBasedOnPaymentMethod(false);
const CAMPAIGN_ID = campaignInfo.vrioCampaignId;
const INTEGRATION_ID = campaignInfo.integrationId;
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

const THANK_YOU_NEXT_PAGE_SLUG = "";

function getNextPageSlugForRedirect() {
  const normalize = (value) => {
    if (!value) return "";
    return value.startsWith("/69fe4e4ba709c6f249d61971-preview") ? value : (value.startsWith("/") ? "/69fe4e4ba709c6f249d61971-preview" + value : "/69fe4e4ba709c6f249d61971-preview/" + value);
  };
  if (THANK_YOU_NEXT_PAGE_SLUG) return normalize(THANK_YOU_NEXT_PAGE_SLUG);
  return "/";
}
const PAYMENT_METHODS_IDS = {"creditCard":1,"googlePay":3,"applePay":4,"paypal":6,"klarna":12};

const prices = [{"name":"VIP Customer Benefits","id":26,"quantity":1,"price":24.99,"shippable":false,"fullPrice":24.99,"finalPrice":24.99,"productName":"VIP Customer Benefits","discountAmount":0,"discountPercentage":0},{"name":"1x Vital Shoulder Massager","id":1936,"quantity":1,"price":0,"shippable":false,"fullPrice":0,"finalPrice":0,"productName":"1x Vital Shoulder Massager","discountAmount":0,"discountPercentage":0},{"name":"2x Vital Shoulder Massager","id":1937,"quantity":1,"price":0,"shippable":false,"fullPrice":0,"finalPrice":0,"productName":"2x Vital Shoulder Massager","discountAmount":0,"discountPercentage":0},{"name":"3x Vital Shoulder Massager","id":1938,"quantity":1,"price":0,"shippable":false,"fullPrice":0,"finalPrice":0,"productName":"3x Vital Shoulder Massager","discountAmount":0,"discountPercentage":0},{"name":"4x Vital Shoulder Massager","id":1939,"quantity":1,"price":0,"shippable":false,"fullPrice":0,"finalPrice":0,"productName":"4x Vital Shoulder Massager","discountAmount":0,"discountPercentage":0},{"name":"Porch Pirate - Guarantee","id":2052,"quantity":1,"price":0,"shippable":false,"fullPrice":0,"finalPrice":0,"productName":"Porch Pirate - Guarantee","discountAmount":0,"discountPercentage":0},{"name":"Special 1x EXTRA Vital Shoulder Massager","id":1942,"quantity":1,"price":0,"shippable":false,"fullPrice":0,"finalPrice":0,"productName":"Special 1x EXTRA Vital Shoulder Massager","discountAmount":0,"discountPercentage":0},{"name":"Special 1x EXTRA Vital Shoulder Massager","id":1943,"quantity":1,"price":0,"shippable":false,"fullPrice":0,"finalPrice":0,"productName":"Special 1x EXTRA Vital Shoulder Massager","discountAmount":0,"discountPercentage":0},{"name":"Vital Shoulder Massager   Journey Package Protection","id":1941,"quantity":1,"price":0,"shippable":false,"fullPrice":0,"finalPrice":0,"productName":"Vital Shoulder Massager   Journey Package Protection","discountAmount":0,"discountPercentage":0},{"name":"Vital Shoulder Massager - 3 Year Warranty","id":1940,"quantity":1,"price":0,"shippable":false,"fullPrice":0,"finalPrice":0,"productName":"Vital Shoulder Massager - 3 Year Warranty","discountAmount":0,"discountPercentage":0}];
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
const isKlarnaPayment = isKlarnaSelected();

const applyKlarnaVisibilityForThankYou = () => {
  
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

if (true) {
  sessionStorage.removeItem('cart');
  sessionStorage.removeItem('cart_token');
  sessionStorage.removeItem('payment_token_id');
  sessionStorage.removeItem('PayerID');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('ba_token');
}
const elementsMappingContent = {
  // lead data
  "[data-email]": (orderDetails) => orderDetails.customer.email,
  "[data-first-name]": (orderDetails) => orderDetails.customer_address_shipping.fname,
  "[data-last-name]": (orderDetails) => orderDetails.customer_address_shipping.lname,
  "[data-billing-first-name]": (orderDetails) => orderDetails.customer_address_billing.fname ?? orderDetails.customer_address_shipping.fname,
  "[data-billing-last-name]": (orderDetails) => orderDetails.customer_address_billing.lname ?? orderDetails.customer_address_shipping.lname,
  "[data-phone]": (orderDetails) => orderDetails.customer.phone,

  // shipping address
  "[data-line-1]": (orderDetails) =>
    orderDetails.customer_address_shipping.address1,
  "[data-line-2]": (orderDetails) =>
    orderDetails.customer_address_shipping.address2,
  "[data-city]": (orderDetails) => orderDetails.customer_address_shipping.city,
  "[data-select-countries]": (orderDetails) =>
    orderDetails.customer_address_shipping.country,
  "[data-select-states]": (orderDetails) =>
    orderDetails.customer_address_shipping.state,
  "[data-zip-code]": (orderDetails) =>
    orderDetails.customer_address_shipping.zipcode,

  // billing address
  "[data-billing-line-1]": (orderDetails) =>
    orderDetails.customer_address_billing.address1,
  "[data-billing-line-2]": (orderDetails) =>
    orderDetails.customer_address_billing.address2,
  "[data-billing-city]": (orderDetails) =>
    orderDetails.customer_address_billing.city,
  "[data-billing-select-countries]": (orderDetails) =>
    orderDetails.customer_address_billing.country,
  "[data-billing-select-states]": (orderDetails) =>
    orderDetails.customer_address_billing.state,
  "[data-billing-zip-code]": (orderDetails) =>
    orderDetails.customer_address_billing.zipcode,

  // order data
  "[data-holder='order_date']": (orderDetails) => {
    if (orderDetails) {
      // "2023-04-01 00:00:00" → "2023-04-01"
      const isoDate = orderDetails.date_created.split(" ")[0]; 
      const [year, month, day] = isoDate.split("-");
      return formatDateByConvention(year, month, day);
    }

    // Fallback: today's date
    const d = new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return formatDateByConvention(year, month, day);
  },
};



document.addEventListener("DOMContentLoaded", async () => {
  try {
  applyKlarnaVisibilityForThankYou();
  const orderids = JSON.parse(sessionStorage.getItem("orderids"));

  const endpoint =
    `orders?order_id=${orderids.join(",")}` +
    `&with=order_offers,customer_address_billing,customer_address_shipping,customer,transactions,cart&pageId=q4Wnmz7xNA0XjbDRpD9NOwtj6qixQJIalBMj5xZ7HLPxwC6fXwpX0UAB7nYcWfIs`

  const response = await fetch(
    `https://app-cms-api-proxy-prod-001.azurewebsites.net/vrio/${endpoint}`,
    {
      method: "GET",
      headers: {
        authorization: `appkey ${INTEGRATION_ID}`,
        "Content-Type": "application/json; charset=utf-8",
      },
    }
  );

  const orderDetails = await response.json();

  for (const selector in elementsMappingContent) {
    const htmlElements = Array.from(document.querySelectorAll(selector));
    if (htmlElements.length > 0) {
      const elementContent = elementsMappingContent[selector];
      if (typeof elementContent === "function") {
        const content = elementsMappingContent[selector](
          orderDetails.orders[0]
        );
        if (htmlElements) {
          htmlElements.forEach((element) => (element.innerHTML = content || ''));
        }
      } else if (typeof elementContent === "string") {
        const content = orderDetails.orders[0][elementContent];
        htmlElements.forEach((element) => (element.innerText = content || ''));
      } else {
        htmlElements.forEach((element) => (element.style.display = "none"));
      }
    }
  }

  const orderSummaryItems = document.querySelector(
    "[data-order-summary-items]"
  );
  const initSummary = {
    items: [],
    totals: { subtotal: 0, shipping: 0, tax: 0 },
  };

  summary = initSummary;
  const totalPriceOfProductsChargedAfterMonth = orderDetails.orders.reduce(
    (accOrdersPrice, order) =>
      accOrdersPrice +
      (order.order_offers
        ?.filter((orderOffer) => orderOffer.charge_timeframe_name === 'Monthly')
        ?.reduce(
          (accOfferPrice, offer) => {
            const isVipUpsellFree = Number(offer.order_offer_price) === 0;
            if (!isVipUpsellFree) {
              return accOfferPrice;
            }
            const recurringAmount = Number(offer.last_recurring_amount) || 0;
            return accOfferPrice + recurringAmount;
          },
          0,
        ) ?? 0),
    0,
  );

  const ordersWithFilteredTransactions = orderDetails.orders.map((order) => ({
    ...order,
    filteredTransactions: (order.transactions || []).filter(
      (transaction) =>
        transaction?.transaction_declined !== true && !!transaction?.date_complete
    ),
  }));

  const orderTotal = ordersWithFilteredTransactions.reduce((acc, order) => {
    if (order.cart) return Number(order.cart.total_items) + acc;
    // Fallback: sum transaction prices when cart is null (e.g. Klarna)
    return order.filteredTransactions.reduce(
      (tAcc, t) => tAcc + Number(t.transaction_price || 0),
      acc
    );
  }, 0)
  summary.totals.subtotal = Math.max(orderTotal - totalPriceOfProductsChargedAfterMonth, 0);
  summary.totals.shipping = ordersWithFilteredTransactions.reduce((acc, order) => {
    if (order.cart) return Number(order.cart.total_shipping) + acc;
    return order.filteredTransactions.reduce(
      (tAcc, t) => tAcc + Number(t.transaction_shipping || 0),
      acc
    );
  }, 0);
  summary.totals.tax = ordersWithFilteredTransactions.reduce((acc, order) => {
    if (order.cart) return Number(order.cart.total_tax) + acc;
    return order.filteredTransactions.reduce(
      (tAcc, t) => tAcc + Number(t.transaction_tax || 0),
      acc
    );
  }, 0);

  const productCustomData = JSON.parse(sessionStorage.getItem("productCustomData")) || {};
  orderDetails.orders.forEach((order) => {
    const offers = order.cart
      ? order.cart.offers
      : (order.order_offers || []).map((oo) => ({
          item_id: oo.order_offer_items?.[0]?.item_id,
          item_name: oo.order_offer_items?.[0]?.item_name || oo.offer_name,
          order_offer_quantity: oo.order_offer_quantity,
          total: Number(oo.order_offer_price)
        })); 

    offers.forEach((item) => {
      const itemData = item;
      const notExtra = !itemData.item_name.toLowerCase().includes("extra");
      const notGift = productCustomData[itemData.item_id]?.customIsGift !== "true";
      const qtyZeroOrFree = itemData.order_offer_quantity <= 0 || itemData.total <= 0;
      if (notExtra && notGift && qtyZeroOrFree) {
        return;
      }
      const line_item = {
        name:
          productCustomData[itemData.item_id]?.customProductName ||
          itemData.item_name,
        quantity: itemData.order_offer_quantity,
        price: Number(itemData.total),
        summaryRowOrder: productCustomData[itemData.item_id]?.customSummaryRow || 0,
      };
      summary.items.push(line_item);
    });
  });

  const total = 
    summary.totals.subtotal +
    summary.totals.shipping +
    summary.totals.tax
  ;
  let items = '';
  initSummary.items
    .sort((i1, i2) => i1.summaryRowOrder - i2.summaryRowOrder)
    .forEach((item) => {
      items += `
        <div style="display: flex;justify-content: space-between;width: 100%;">
          <div> ${item.quantity > 1 ? `${item.quantity}x` : '' } ${item.name}</div>
          <div style="text-align:center; min-width: 50px;">${item.price > 0 ? formatPrice(item.price) : i18n.pricingText.free}</div>
        </div>
        `;
    });

  orderSummaryItems.innerHTML = items;
  const editSubmitBtn = document.querySelector('[data-submit-address]');
  if (editSubmitBtn) {
    const editableElements = [...document.querySelectorAll('[data-content-editable]')];
    const editBtn = document.querySelector('[data-edit-address]');
    const editBtnText = editBtn.innerText;
    let confirmClickedOnce = false;
    const countryEl = document.querySelector("[data-select-countries]");
    const countriesMap = {
      "US": "United States",
      "CA": "Canada",
      "GB": "United Kingdom",
      "AU": "Australia",
      "DE": "Deutschland",
      "FR": "France",
      "ES": "España",
      "IT": "Italia",
    }

    function buildCountrySelect(currentValue) {
      const select = document.createElement("select");
      select.style.width = "100%";
      select.setAttribute("data-testid", "dropdown-country");
      campaignInfo.countries.forEach((country) => {
        const option = document.createElement("option");
        option.value = country.iso_2;
        option.textContent = countriesMap[country.iso_2] || country.name;
        if (country.iso_2 === currentValue || country.name === currentValue) {
          option.selected = true;
        }
        select.appendChild(option);
      });
      return select;
    }

    function enterCountryEditMode() {
      if (!countryEl) return;
      const currentValue = countryEl.innerHTML.trim();
      countryEl.innerHTML = "";
      countryEl.appendChild(buildCountrySelect(currentValue));
      countryEl.classList.add("editable-on");
    }

    function exitCountryEditMode() {
      if (!countryEl) return;
      const select = countryEl.querySelector("select");
      if (!select) return;
      countryEl.innerHTML = select.value;
      countryEl.classList.remove("editable-on");
    }

    async function submitEditAddress() {
      editSubmitBtn.setAttribute('disabled', 'true');
      editSubmitBtn.style.cursor = 'wait';
      document.body.style.cursor = 'wait';

      if (editableElements[0]?.getAttribute('contenteditable') === 'true') {
        editBtn.click();
      }
      const data = editableElements.reduce((acc, el) => {
        const firstDataSet = Object.keys(el.dataset)[0];
        const innerSelect = el.querySelector("select");
        acc[firstDataSet] = innerSelect ? innerSelect.value : el.innerHTML;
        return acc;
      }, {});

      const orderIds = JSON.parse(sessionStorage.getItem('orderids'));

      const customerId = orderDetails.orders[0].customer.customer_id;

      try {
        const body = {
          orders: orderIds,
          fname: data.firstName,
          lname: data.lastName,
          address1: data['line-1'],
          city: data.city,
          state: data.selectStates,
          zipcode: data.zipCode,
          country: data.selectCountries,
          address2: data['line-2'] || '',
          address_type: 'shipping',
        };

        const response = await fetch(
          `https://app-cms-api-proxy-prod-001.azurewebsites.net/vrio/customers/${customerId}/addresses`,
          {
            method: 'POST',
            headers: {
              authorization: `appkey ${INTEGRATION_ID}`,
              'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify(body),
          }
        );

        const orderData = await JSON.parse(sessionStorage.getItem('orderData'));

        orderData.ship_fname = data.firstName;
        orderData.ship_lname = data.lastName;
        orderData.ship_address1 = data['line-1'];
        orderData.ship_city = data.city;
        orderData.ship_state = data.selectStates;
        orderData.ship_zipcode = data.zipCode;
        orderData.ship_country = data.selectCountries;
        orderData.ship_address2 = data['line-2'] || '';

        sessionStorage.setItem('orderData', JSON.stringify(orderData));

        editSubmitBtn.setAttribute("style", "display:none !important");
        editBtn.setAttribute("style", "width: 100% !important");
        editBtn.innerHTML = `<span>${editBtnText}</span>`;
        editBtn.classList.add("edit-btn-shw");
        editBtn.classList.remove("cancel-btn");

        exitCountryEditMode();
        editableElements.forEach((el) => {
          if (el === countryEl) return;
          el.setAttribute("contenteditable", false);
          el.classList.remove("editable-on");
        });

        document.body.style.cursor = 'default';
      } catch (error) {
        console.error('Error updating order:', error);
      }
    }
  formEl = document.querySelector('[data-address-form]');
  const validate = new JustValidate(formEl, {
    errorFieldCssClass: ['field__is-invalid'],
    errorLabelCssClass: ['label__is-invalid'],
    validateBeforeSubmitting: true,
    validateOnBlur: true,
    focusInvalidField: true,
    lockForm: true,
    tooltip: {
      position: 'top',
    },
    errorFieldCssClass: 'is-invalid',
    errorLabelCssClass: 'error-message',
    errorLabelStyle: {
      color: '#ff3860',
      marginTop: '0.25rem',
      fontSize: '0.875rem',
    },
  });

  initializeFormValidation();
  function getInputs() {
    return document.querySelectorAll(`
      [data-first-name], 
      [data-last-name],
      [data-line-1],
      [data-line-2],
      [data-city],
      [data-select-states],
      [data-select-countries],
      [data-zip-code]
    `);
  }
  function clearValidationFeedback() {
    getInputs().forEach((input) => {
      input.classList.remove(
        "error",
        "is-invalid",
        "valid",
        "just-validate-success-field",
      );
    });
  }

  editSubmitBtn.addEventListener("click", (e) => {
    clearValidationFeedback();

    if (
      !editableElements
        .filter((el) => el !== countryEl)
        .every((el) => el.getAttribute("contenteditable") === "true")
    ) {
      e.preventDefault();
      confirmClickedOnce = true;
      editSubmitBtn.setAttribute("style", "display:none !important");
      editBtn.setAttribute("style", "width: 100% !important");
    } else {
      confirmClickedOnce = true;
    }
  });

  editBtn.addEventListener("click", () => {
    clearValidationFeedback();

    if (
      editableElements
        .filter((el) => el !== countryEl)
        .every((el) => el.getAttribute("contenteditable") === "true")
    ) {
      editBtn.innerHTML = `<span>${editBtnText}</span>`;
      editBtn.classList.add("edit-btn-shw");
      editBtn.classList.remove("cancel-btn");
      
      exitCountryEditMode();
      editableElements.forEach((el) => {
        if (el === countryEl) return;
        el.setAttribute("contenteditable", false);
        el.classList.remove("editable-on");
      });

      if (confirmClickedOnce) {
        editSubmitBtn.setAttribute("style", "display:none !important");
        editBtn.setAttribute("style", "width: 100% !important");
      } else {
        editSubmitBtn.removeAttribute("style");
        editSubmitBtn.style.flex = "1";
        editBtn.removeAttribute("style");
      }
    } else {
      editSubmitBtn.removeAttribute("style");
      editSubmitBtn.style.flex = "none";
      editBtn.removeAttribute("style");

      editBtn.classList.add("cancel-btn");
      editBtn.classList.remove("edit-btn-shw");

      editBtn.innerHTML = `
        <img
          src="https://stdigitalmvmtprod001.blob.core.windows.net/assets/develop/edit-address-back-tr.png"
          alt="Cancel Edit"
          width="9.5"
          height="16"
          class="back-btn-img"
        />`;

      editBtn.addEventListener("mouseover", () => {
        const backImg = document.querySelector(".back-btn-img");
        if (backImg) backImg.src = "https://stdigitalmvmtprod001.blob.core.windows.net/assets/develop/edit-address-back-white.png";
      });

      editBtn.addEventListener("mouseout", () => {
        const backImg = document.querySelector(".back-btn-img");
        if (backImg) backImg.src = "https://stdigitalmvmtprod001.blob.core.windows.net/assets/develop/edit-address-back-tr.png";
      });

      enterCountryEditMode();
      editableElements.forEach((el) => {
        if (el === countryEl) return;
        el.setAttribute("contenteditable", true);
        el.classList.add("editable-on");
      });
      editableElements[0].focus();
    }
  });

  generalError = document.querySelector('[data-general-error]');

  async function initializeFormValidation() {
    const fields = getInputs();
    const validateField = async (field) => {
      const dataAttr = Object.keys(field.dataset)[0]?.replace(
        /[A-Z]/g,
        (letter) => `-${letter.toLowerCase()}`
      );
      if (dataAttr) {
        const selector = `[data-${dataAttr}]`;
        const isValid = await validate.revalidateField(selector);
        if (!isValid) {
          field.classList.add('error');
        } else {
          field.classList.remove('error');
          field.classList.add('valid');
          editSubmitBtn.removeAttribute('disabled');
        }
      }
    };

    let debounceTimer;
    Array.from(fields).forEach((field) => {
      field.addEventListener('input', async () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
          await validateField(field);
        }, 500);
      });
      field.addEventListener('blur', () => validateField(field));
    });
  }

  // Just Validate validation for each field in the form
  function getFieldContent(selector) {
    const el = document.querySelector(selector);
    if (!el) return '';
    const innerSelect = el.querySelector("select");
    if (innerSelect) return innerSelect.value;
    if (el.hasAttribute('contenteditable')) {
      return el.innerHTML.trim();
    }
    if (el.innerHTML === "<br>") {
      el.innerHTML = '';
    }
    return el.innerHTML !== undefined ? el.innerHTML.trim() : '';
  }

  validate
    .addField('[data-first-name]', [
      {
        validator: () => getFieldContent('[data-first-name]').length > 0,
        errorMessage: i18n.validation.firstNameRequired,
      },
      {
        validator: () => getFieldContent('[data-first-name]').length <= 255,
        errorMessage: i18n.validation.maxLength255,
      },
      {
        validator: () => i18n.validationPatterns.nameRegex.test(getFieldContent('[data-first-name]')),
        errorMessage: i18n.validation.invalidCharacter,
      },
    ])
    .addField('[data-last-name]', [
      {
        validator: () => getFieldContent('[data-last-name]').length > 0,
        errorMessage: i18n.validation.lastNameRequired,
      },
      {
        validator: () => getFieldContent('[data-last-name]').length <= 255,
        errorMessage: i18n.validation.maxLength255,
      },
      {
        validator: () => i18n.validationPatterns.nameRegex.test(getFieldContent('[data-last-name]')),
        errorMessage: i18n.validation.invalidCharacter,
      },
    ])
    .addField('[data-line-1]', [
      {
        validator: () => getFieldContent('[data-line-1]').length > 0,
        errorMessage: i18n.validation.shippingAddressRequired,
      },
      {
        validator: () => getFieldContent('[data-line-1]').length <= 255,
        errorMessage: i18n.validation.maxLength255,
      },
    ])
    .addField('[data-line-2]', [
      {
        validator: () => getFieldContent('[data-line-2]').length <= 255,
        errorMessage: i18n.validation.maxLength255,
      },
    ])
    .addField('[data-city]', [
      {
        validator: () => getFieldContent('[data-city]').length > 0,
        errorMessage: i18n.validation.cityRequired,
      },
      {
        validator: () => getFieldContent('[data-city]').length <= 255,
        errorMessage: i18n.validation.maxLength255,
      },
    ])
    .addField('[data-select-countries]', [
      {
        validator: () => getFieldContent('[data-select-countries]').length > 0,
        errorMessage: i18n.validation.countryRequired,
      },
    ])
    .addField('[data-zip-code]', [
      {
        validator: () => getFieldContent('[data-zip-code]').length > 0,
        errorMessage: i18n.validation.zipRequired,
      },
      {
        validator: () => i18n.validationPatterns.zipCodeRegex.test(getFieldContent('[data-zip-code]')),
        errorMessage: i18n.validation.zipInvalid,
      },
    ])
    .onFail((fields) => {
      const fieldsArray = Object.entries(fields);
      for (let i = 0; i < fieldsArray.length; i += 1) {
        const [fieldSelector, data] = fieldsArray[i];
        const field = document.querySelector(fieldSelector);
        data.isValid
          ? field.classList.remove('error')
          : field.classList.add('error');
      }
      editSubmitBtn.setAttribute('disabled', true);
      const id = setTimeout(() => {
        const field = fieldsArray[0][1];
        field.elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        clearTimeout(id);
      }, 150);
    })
    .onSuccess(submitEditAddress);
    const stateField = document.querySelector("[data-select-states]");
    const orderData = JSON.parse(sessionStorage.getItem("orderData"));
    const hasState = orderData?.ship_state;

    if (stateField && !hasState) {
      stateField.remove();
    } else {
      validate.addField("[data-select-states]", [
        {
          validator: () => getFieldContent("[data-select-states]").length > 0,
          errorMessage: i18n.validation.stateRequired,
        },
      ]); 
    }
  }
  const totalExclTax = document.querySelector("[data-holder='total_excl_tax']");
  if (totalExclTax) {
    totalExclTax.innerText = formatPrice(summary.totals.subtotal + summary.totals.shipping);
  }
  const shippingExclTax = 
  document.querySelector("[data-holder='shipping_excl_tax']");
  if (shippingExclTax) {
    shippingExclTax.innerText = summary.totals.shipping ? formatPrice(summary.totals.shipping) : i18n.pricingText.free;
  }
  const totalInclTax = document.querySelectorAll("[data-holder='total_incl_tax']");
  
  if (totalInclTax && totalInclTax.length > 0) {
    totalInclTax.forEach((element) => (element.innerText = formatPrice(total)));
  }

  const orderNumber = document.querySelector("[data-holder='order_number']");
  if (orderNumber) {
    orderNumber.innerText = orderids.join(", ");
  }

  const orderData = JSON.parse(sessionStorage.getItem('orderData'));
  const orderEmail = document.querySelector("[data-holder='order_email']");
  if (orderEmail && orderData?.email) {
    orderEmail.innerText = orderData?.email;
  }

  
  } finally { if (window.__hidePreloader) window.__hidePreloader(); }
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
};
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
      type: "ThankYou",
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
      step: "ThankYou",
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
};;

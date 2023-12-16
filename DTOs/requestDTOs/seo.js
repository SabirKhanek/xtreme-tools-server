const Joi = require("joi");

const DAPAschema = Joi.object({
  target: Joi.string()
    .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .message("Invalid domain format. Please provide a valid domain name.")
    .required(),
});

const BacklinksCheckerSchema = Joi.object({
  domain: Joi.string()
    .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .message("Invalid domain format. Please provide a valid domain name.")
    .required(),
});

const countries = [
  { code: "AR", country: "Argentina" },
  { code: "AU", country: "Australia" },
  { code: "BR", country: "Brazil" },
  { code: "CA", country: "Canada" },
  { code: "FI", country: "Finland" },
  { code: "FR", country: "France" },
  { code: "GE", country: "Georgia" },
  { code: "DE", country: "Germany" },
  { code: "HK", country: "Hong Kong" },
  { code: "HU", country: "Hungary" },
  { code: "IS", country: "Iceland" },
  { code: "IN", country: "India" },
  { code: "ID", country: "Indonesia" },
  { code: "IE", country: "Ireland" },
  { code: "IL", country: "Israel" },
  { code: "IT", country: "Italy" },
  { code: "JP", country: "Japan" },
  { code: "JE", country: "Jersey" },
  { code: "JO", country: "Jordan" },
  { code: "KW", country: "Kuwait" },
  { code: "LV", country: "Latvia" },
  { code: "MG", country: "Madagascar" },
  { code: "MW", country: "Malawi" },
  { code: "MY", country: "Malaysia" },
  { code: "MV", country: "Maldives" },
  { code: "MT", country: "Malta" },
  { code: "MU", country: "Mauritius" },
  { code: "YT", country: "Mayotte" },
  { code: "MX", country: "Mexico" },
  { code: "NP", country: "Nepal" },
  { code: "NL", country: "Netherlands" },
  { code: "NZ", country: "New Zealand" },
  { code: "NG", country: "Nigeria" },
  { code: "NF", country: "Norfolk Island" },
  { code: "NO", country: "Norway" },
  { code: "OM", country: "Oman" },
  { code: "PK", country: "Pakistan" },
  { code: "PW", country: "Palau" },
  { code: "PY", country: "Paraguay" },
  { code: "PE", country: "Peru" },
  { code: "PH", country: "Philippines" },
  { code: "PN", country: "Pitcairn" },
  { code: "PL", country: "Poland" },
  { code: "PT", country: "Portugal" },
  { code: "QA", country: "Qatar" },
  { code: "RO", country: "Romania" },
  { code: "RU", country: "Russian Federation" },
  { code: "SA", country: "Saudi Arabia" },
  { code: "SG", country: "Singapore" },
  { code: "ZA", country: "South Africa" },
  { code: "KR", country: "South Korea" },
  { code: "SS", country: "South Sudan" },
  { code: "ES", country: "Spain" },
  { code: "LK", country: "Sri Lanka" },
  { code: "SE", country: "Sweden" },
  { code: "CH", country: "Switzerland" },
  { code: "TH", country: "Thailand" },
  { code: "TR", country: "Turkey" },
  { code: "UG", country: "Uganda" },
  { code: "UA", country: "Ukraine" },
  { code: "GB", country: "United Kingdom" },
  { code: "UM", country: "United States Minor Outlying Islands" },
  { code: "US", country: "United States of America" },
  { code: "UY", country: "Uruguay" },
  { code: "UZ", country: "Uzbekistan" },
  { code: "VU", country: "Vanuatu" },
  { code: "VN", country: "Vietnam" },
  { code: "VG", country: "Virgin Islands, British" },
  { code: "VI", country: "Virgin Islands, U.S." },
];

const KeywordResearch = Joi.object({
  keyword: Joi.string().min(3).message("Keyword is too short").required(),
  country: Joi.string()
    .lowercase()
    .valid(...countries.map((country) => country.code.toLowerCase()))
    .optional(),
});

const KeywordResearchByWebsiteSchema = Joi.object({
  url: Joi.string()
    .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .message("Invalid domain format. Please provide a valid domain name.")
    .required(),
});

const PeopleAskFor = Joi.object({
  keyword: Joi.string().min(3).message("Keyword is too short").required(),
});

module.exports = {
  DAPAschema,
  BacklinksCheckerSchema,
  KeywordResearch,
  KeywordResearchByWebsiteSchema,
  PeopleAskFor,
};

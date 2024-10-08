const COUNTRIES = [
  {
    countryName: "Afghanistan",
    countryShortCode: "AF",
    region: "Other",
  },
  {
    countryName: "Åland Islands",
    countryShortCode: "AX",
    region: "Other",
  },
  {
    countryName: "Albania",
    countryShortCode: "AL",
    region: "Europe",
  },
  {
    countryName: "Algeria",
    countryShortCode: "DZ",
    region: "Other",
  },
  {
    countryName: "American Samoa",
    countryShortCode: "AS",
    region: "Australia",
  },
  {
    countryName: "Andorra",
    countryShortCode: "AD",
    region: "Europe",
  },
  {
    countryName: "Angola",
    countryShortCode: "AO",
    region: "Other",
  },
  {
    countryName: "Anguilla",
    countryShortCode: "AI",
    region: "Other",
  },
  {
    countryName: "Antarctica",
    countryShortCode: "AQ",
    region: "Other",
  },
  {
    countryName: "Antigua and Barbuda",
    countryShortCode: "AG",
    region: "USA",
  },
  {
    countryName: "Argentina",
    countryShortCode: "AR",
    region: "USA",
  },
  {
    countryName: "Armenia",
    countryShortCode: "AM",
    region: "Other",
  },
  {
    countryName: "Aruba",
    countryShortCode: "AW",
    region: "USA",
  },
  {
    countryName: "Australia",
    countryShortCode: "AU",
    region: "Australia",
  },
  {
    countryName: "Austria",
    countryShortCode: "AT",
    region: "Europe",
  },
  {
    countryName: "Azerbaijan",
    countryShortCode: "AZ",
    region: "Other",
  },
  {
    countryName: "Bahrain",
    countryShortCode: "BH",
    region: "Other",
  },
  {
    countryName: "Bahamas",
    countryShortCode: "BS",
    region: "USA",
  },
  {
    countryName: "Bangladesh",
    countryShortCode: "BD",
    region: "Other",
  },
  {
    countryName: "Barbados",
    countryShortCode: "BB",
    region: "USA",
  },
  {
    countryName: "Belarus",
    countryShortCode: "BY",
    region: "Other",
  },
  {
    countryName: "Belgium",
    countryShortCode: "BE",
    region: "Europe",
  },
  {
    countryName: "Belize",
    countryShortCode: "BZ",
    region: "USA",
  },
  {
    countryName: "Benin",
    countryShortCode: "BJ",
    region: "Other",
  },
  {
    countryName: "Bermuda",
    countryShortCode: "BM",
    region: "USA",
  },
  {
    countryName: "Bhutan",
    countryShortCode: "BT",
    region: "Other",
  },
  {
    countryName: "Bolivia, Plurinational State of",
    countryShortCode: "BO",
    region: "USA",
  },
  {
    countryName: "Bonaire, Sint Eustatius and Saba",
    countryShortCode: "BQ",
    region: "Other",
  },
  {
    countryName: "Bosnia and Herzegovina",
    countryShortCode: "BA",
    region: "Europe",
  },
  {
    countryName: "Botswana",
    countryShortCode: "BW",
    region: "Other",
  },
  {
    countryName: "Bouvet Island",
    countryShortCode: "BV",
    region: "Other",
  },
  {
    countryName: "Brazil",
    countryShortCode: "BR",
    region: "USA",
  },
  {
    countryName: "British Indian Ocean Territory",
    countryShortCode: "IO",
    region: "Other",
  },
  {
    countryName: "Brunei Darussalam",
    countryShortCode: "BN",
    region: "Other",
  },
  {
    countryName: "Bulgaria",
    countryShortCode: "BG",
    region: "Europe",
  },
  {
    countryName: "Burkina Faso",
    countryShortCode: "BF",
    region: "Other",
  },
  {
    countryName: "Burundi",
    countryShortCode: "BI",
    region: "Other",
  },
  {
    countryName: "Cabo Verde",
    countryShortCode: "CV",
    region: "Other",
  },
  {
    countryName: "Cambodia",
    countryShortCode: "KH",
    region: "Other",
  },
  {
    countryName: "Cameroon",
    countryShortCode: "CM",
    region: "Other",
  },
  {
    countryName: "Canada",
    countryShortCode: "CA",
    region: "USA",
  },
  {
    countryName: "Cayman Islands",
    countryShortCode: "KY",
    region: "USA",
  },
  {
    countryName: "Central African Republic",
    countryShortCode: "CF",
    region: "Other",
  },
  {
    countryName: "Chad",
    countryShortCode: "TD",
    region: "Other",
  },
  {
    countryName: "Chile",
    countryShortCode: "CL",
    region: "USA",
  },
  {
    countryName: "China",
    countryShortCode: "CN",
    region: "Other",
  },
  {
    countryName: "Christmas Island",
    countryShortCode: "CX",
    region: "Other",
  },
  {
    countryName: "Cocos (Keeling) Islands",
    countryShortCode: "CC",
    region: "Other",
  },
  {
    countryName: "Colombia",
    countryShortCode: "CO",
    region: "USA",
  },
  {
    countryName: "Comoros",
    countryShortCode: "KM",
    region: "Other",
  },
  {
    countryName: "Congo",
    countryShortCode: "CG",
    region: "Other",
  },
  {
    countryName: "Congo, the Democratic Republic of the",
    countryShortCode: "CD",
    region: "Other",
  },
  {
    countryName: "Cook Islands",
    countryShortCode: "CK",
    region: "Australia",
  },
  {
    countryName: "Costa Rica",
    countryShortCode: "CR",
    region: "USA",
  },
  {
    countryName: "Côte d'Ivoire",
    countryShortCode: "CI",
    region: "Other",
  },
  {
    countryName: "Croatia",
    countryShortCode: "HR",
    region: "Europe",
  },
  {
    countryName: "Cuba",
    countryShortCode: "CU",
    region: "USA",
  },
  {
    countryName: "Curaçao",
    countryShortCode: "CW",
    region: "USA",
  },
  {
    countryName: "Cyprus",
    countryShortCode: "CY",
    region: "Europe",
  },
  {
    countryName: "Czech Republic",
    countryShortCode: "CZ",
    region: "Europe",
  },
  {
    countryName: "Denmark",
    countryShortCode: "DK",
    region: "Europe",
  },
  {
    countryName: "Djibouti",
    countryShortCode: "DJ",
    region: "Other",
  },
  {
    countryName: "Dominica",
    countryShortCode: "DM",
    region: "USA",
  },
  {
    countryName: "Dominican Republic",
    countryShortCode: "DO",
    region: "USA",
  },
  {
    countryName: "Ecuador",
    countryShortCode: "EC",
    region: "USA",
  },
  {
    countryName: "Egypt",
    countryShortCode: "EG",
    region: "Other",
  },
  {
    countryName: "El Salvador",
    countryShortCode: "SV",
    region: "USA",
  },
  {
    countryName: "Equatorial Guinea",
    countryShortCode: "GQ",
    region: "Other",
  },
  {
    countryName: "Eritrea",
    countryShortCode: "ER",
    region: "Other",
  },
  {
    countryName: "Estonia",
    countryShortCode: "EE",
    region: "Europe",
  },
  {
    countryName: "Ethiopia",
    countryShortCode: "ET",
    region: "Other",
  },
  {
    countryName: "Falkland Islands (Malvinas)",
    countryShortCode: "FK",
    region: "Other",
  },
  {
    countryName: "Faroe Islands",
    countryShortCode: "FO",
    region: "Europe",
  },
  {
    countryName: "Fiji",
    countryShortCode: "FJ",
    region: "Australia",
  },
  {
    countryName: "Finland",
    countryShortCode: "FI",
    region: "Europe",
  },
  {
    countryName: "France",
    countryShortCode: "FR",
    region: "Europe",
  },
  {
    countryName: "French Guiana",
    countryShortCode: "GF",
    region: "USA",
  },
  {
    countryName: "French Polynesia",
    countryShortCode: "PF",
    region: "Australia",
  },
  {
    countryName: "French Southern Territories",
    countryShortCode: "TF",
    region: "Other",
  },
  {
    countryName: "Gabon",
    countryShortCode: "GA",
    region: "Other",
  },
  {
    countryName: "Gambia",
    countryShortCode: "GM",
    region: "Other",
  },
  {
    countryName: "Georgia",
    countryShortCode: "GE",
    region: "Other",
  },
  {
    countryName: "Germany",
    countryShortCode: "DE",
    region: "Europe",
  },
  {
    countryName: "Ghana",
    countryShortCode: "GH",
    region: "Other",
  },
  {
    countryName: "Gibraltar",
    countryShortCode: "GI",
    region: "Europe",
  },
  {
    countryName: "Greece",
    countryShortCode: "GR",
    region: "Europe",
  },
  {
    countryName: "Greenland",
    countryShortCode: "GL",
    region: "Other",
  },
  {
    countryName: "Grenada",
    countryShortCode: "GD",
    region: "USA",
  },
  {
    countryName: "Guadeloupe",
    countryShortCode: "GP",
    region: "USA",
  },
  {
    countryName: "Guam",
    countryShortCode: "GU",
    region: "Australia",
  },
  {
    countryName: "Guatemala",
    countryShortCode: "GT",
    region: "USA",
  },
  {
    countryName: "Guernsey",
    countryShortCode: "GG",
    region: "Europe",
  },
  {
    countryName: "Guinea",
    countryShortCode: "GN",
    region: "Other",
  },
  {
    countryName: "Guinea-Bissau",
    countryShortCode: "GW",
    region: "Other",
  },
  {
    countryName: "Guyana",
    countryShortCode: "GY",
    region: "USA",
  },
  {
    countryName: "Haiti",
    countryShortCode: "HT",
    region: "USA",
  },
  {
    countryName: "Heard Island and McDonald Islands",
    countryShortCode: "HM",
    region: "Other",
  },
  {
    countryName: "Holy See (Vatican City State)",
    countryShortCode: "VA",
    region: "Europe",
  },
  {
    countryName: "Honduras",
    countryShortCode: "HN",
    region: "USA",
  },
  {
    countryName: "Hong Kong",
    countryShortCode: "HK",
    region: "Other",
  },
  {
    countryName: "Hungary",
    countryShortCode: "HU",
    region: "Europe",
  },
  {
    countryName: "Iceland",
    countryShortCode: "IS",
    region: "Europe",
  },
  {
    countryName: "India",
    countryShortCode: "IN",
    region: "Other",
  },
  {
    countryName: "Indonesia",
    countryShortCode: "ID",
    region: "Other",
  },
  {
    countryName: "Iran, Islamic Republic of",
    countryShortCode: "IR",
    region: "Other",
  },
  {
    countryName: "Iraq",
    countryShortCode: "IQ",
    region: "Other",
  },
  {
    countryName: "Ireland",
    countryShortCode: "IE",
    region: "Europe",
  },
  {
    countryName: "Isle of Man",
    countryShortCode: "IM",
    region: "Europe",
  },
  {
    countryName: "Israel",
    countryShortCode: "IL",
    region: "Europe",
  },
  {
    countryName: "Italy",
    countryShortCode: "IT",
    region: "Europe",
  },
  {
    countryName: "Jamaica",
    countryShortCode: "JM",
    region: "USA",
  },
  {
    countryName: "Japan",
    countryShortCode: "JP",
    region: "Other",
  },
  {
    countryName: "Jersey",
    countryShortCode: "JE",
    region: "Europe",
  },
  {
    countryName: "Jordan",
    countryShortCode: "JO",
    region: "Other",
  },
  {
    countryName: "Kazakhstan",
    countryShortCode: "KZ",
    region: "Other",
  },
  {
    countryName: "Kenya",
    countryShortCode: "KE",
    region: "Other",
  },
  {
    countryName: "Kiribati",
    countryShortCode: "KI",
    region: "Australia",
  },
  {
    countryName: "Korea, Democratic People's Republic of",
    countryShortCode: "KP",
    region: "Other",
  },
  {
    countryName: "Korea, Republic of",
    countryShortCode: "KR",
    region: "Other",
  },
  {
    countryName: "Kuwait",
    countryShortCode: "KW",
    region: "Other",
  },
  {
    countryName: "Kyrgyzstan",
    countryShortCode: "KG",
    region: "Other",
  },
  {
    countryName: "Lao People's Democratic Republic",
    countryShortCode: "LA",
    region: "Other",
  },
  {
    countryName: "Latvia",
    countryShortCode: "LV",
    region: "Europe",
  },
  {
    countryName: "Lebanon",
    countryShortCode: "LB",
    region: "Other",
  },
  {
    countryName: "Lesotho",
    countryShortCode: "LS",
    region: "Other",
  },
  {
    countryName: "Liberia",
    countryShortCode: "LR",
    region: "Other",
  },
  {
    countryName: "Libya",
    countryShortCode: "LY",
    region: "Other",
  },
  {
    countryName: "Liechtenstein",
    countryShortCode: "LI",
    region: "Europe",
  },
  {
    countryName: "Lithuania",
    countryShortCode: "LT",
    region: "Europe",
  },
  {
    countryName: "Luxembourg",
    countryShortCode: "LU",
    region: "Europe",
  },
  {
    countryName: "Macao",
    countryShortCode: "MO",
    region: "Other",
  },
  {
    countryName: "Macedonia, the Former Yugoslav Republic of",
    countryShortCode: "MK",
    region: "Europe",
  },
  {
    countryName: "Madagascar",
    countryShortCode: "MG",
    region: "Other",
  },
  {
    countryName: "Malawi",
    countryShortCode: "MW",
    region: "Other",
  },
  {
    countryName: "Malaysia",
    countryShortCode: "MY",
    region: "Other",
  },
  {
    countryName: "Maldives",
    countryShortCode: "MV",
    region: "Other",
  },
  {
    countryName: "Mali",
    countryShortCode: "ML",
    region: "Other",
  },
  {
    countryName: "Malta",
    countryShortCode: "MT",
    region: "Europe",
  },
  {
    countryName: "Marshall Islands",
    countryShortCode: "MH",
    region: "Australia",
  },
  {
    countryName: "Martinique",
    countryShortCode: "MQ",
    region: "USA",
  },
  {
    countryName: "Mauritania",
    countryShortCode: "MR",
    region: "Other",
  },
  {
    countryName: "Mauritius",
    countryShortCode: "MU",
    region: "Other",
  },
  {
    countryName: "Mayotte",
    countryShortCode: "YT",
    region: "Other",
  },
  {
    countryName: "Mexico",
    countryShortCode: "MX",
    region: "USA",
  },
  {
    countryName: "Micronesia, Federated States of",
    countryShortCode: "FM",
    region: "Australia",
  },
  {
    countryName: "Moldova, Republic of",
    countryShortCode: "MD",
    region: "Europe",
  },
  {
    countryName: "Monaco",
    countryShortCode: "MC",
    region: "Europe",
  },
  {
    countryName: "Mongolia",
    countryShortCode: "MN",
    region: "Other",
  },
  {
    countryName: "Montenegro",
    countryShortCode: "ME",
    region: "Europe",
  },
  {
    countryName: "Montserrat",
    countryShortCode: "MS",
    region: "USA",
  },
  {
    countryName: "Morocco",
    countryShortCode: "MA",
    region: "Other",
  },
  {
    countryName: "Mozambique",
    countryShortCode: "MZ",
    region: "Other",
  },
  {
    countryName: "Myanmar",
    countryShortCode: "MM",
    region: "Other",
  },
  {
    countryName: "Namibia",
    countryShortCode: "NA",
    region: "Other",
  },
  {
    countryName: "Nauru",
    countryShortCode: "NR",
    region: "Other",
  },
  {
    countryName: "Nepal",
    countryShortCode: "NP",
    region: "Other",
  },
  {
    countryName: "Netherlands",
    countryShortCode: "NL",
    region: "Europe",
  },
  {
    countryName: "New Caledonia",
    countryShortCode: "NC",
    region: "Australia",
  },
  {
    countryName: "New Zealand",
    countryShortCode: "NZ",
    region: "Australia",
  },
  {
    countryName: "Nicaragua",
    countryShortCode: "NI",
    region: "USA",
  },
  {
    countryName: "Niger",
    countryShortCode: "NE",
    region: "Other",
  },
  {
    countryName: "Nigeria",
    countryShortCode: "NG",
    region: "Other",
  },
  {
    countryName: "Niue",
    countryShortCode: "NU",
    region: "Other",
  },
  {
    countryName: "Norfolk Island",
    countryShortCode: "NF",
    region: "Other",
  },
  {
    countryName: "Northern Mariana Islands",
    countryShortCode: "MP",
    region: "USA",
  },
  {
    countryName: "Norway",
    countryShortCode: "NO",
    region: "Europe",
  },
  {
    countryName: "Oman",
    countryShortCode: "OM",
    region: "Other",
  },
  {
    countryName: "Pakistan",
    countryShortCode: "PK",
    region: "Other",
  },
  {
    countryName: "Palau",
    countryShortCode: "PW",
    region: "Australia",
  },
  {
    countryName: "Palestine, State of",
    countryShortCode: "PS",
    region: "Other",
  },
  {
    countryName: "Panama",
    countryShortCode: "PA",
    region: "USA",
  },
  {
    countryName: "Papua New Guinea",
    countryShortCode: "PG",
    region: "Australia",
  },
  {
    countryName: "Paraguay",
    countryShortCode: "PY",
    region: "USA",
  },
  {
    countryName: "Peru",
    countryShortCode: "PE",
    region: "USA",
  },
  {
    countryName: "Philippines",
    countryShortCode: "PH",
    region: "Other",
  },
  {
    countryName: "Pitcairn",
    countryShortCode: "PN",
    region: "Other",
  },
  {
    countryName: "Poland",
    countryShortCode: "PL",
    region: "Europe",
  },
  {
    countryName: "Portugal",
    countryShortCode: "PT",
    region: "Europe",
  },
  {
    countryName: "Puerto Rico",
    countryShortCode: "PR",
    region: "USA",
  },
  {
    countryName: "Qatar",
    countryShortCode: "QA",
    region: "Other",
  },
  {
    countryName: "Réunion",
    countryShortCode: "RE",
    region: "Other",
  },
  {
    countryName: "Romania",
    countryShortCode: "RO",
    region: "Europe",
  },
  {
    countryName: "Russian Federation",
    countryShortCode: "RU",
    region: "Other",
  },
  {
    countryName: "Rwanda",
    countryShortCode: "RW",
    region: "Other",
  },
  {
    countryName: "Saint Barthélemy",
    countryShortCode: "BL",
    region: "USA",
  },
  {
    countryName: "Saint Helena, Ascension and Tristan da Cunha",
    countryShortCode: "SH",
    region: "Other",
  },
  {
    countryName: "Saint Kitts and Nevis",
    countryShortCode: "KN",
    region: "USA",
  },
  {
    countryName: "Saint Lucia",
    countryShortCode: "LC",
    region: "USA",
  },
  {
    countryName: "Saint Martin (French part)",
    countryShortCode: "MF",
    region: "USA",
  },
  {
    countryName: "Saint Pierre and Miquelon",
    countryShortCode: "PM",
    region: "USA",
  },
  {
    countryName: "Saint Vincent and the Grenadines",
    countryShortCode: "VC",
    region: "USA",
  },
  {
    countryName: "Samoa",
    countryShortCode: "WS",
    region: "Australia",
  },
  {
    countryName: "San Marino",
    countryShortCode: "SM",
    region: "Europe",
  },
  {
    countryName: "Sao Tome and Principe",
    countryShortCode: "ST",
    region: "Other",
  },
  {
    countryName: "Saudi Arabia",
    countryShortCode: "SA",
    region: "Other",
  },
  {
    countryName: "Senegal",
    countryShortCode: "SN",
    region: "Other",
  },
  {
    countryName: "Serbia",
    countryShortCode: "RS",
    region: "Europe",
  },
  {
    countryName: "Seychelles",
    countryShortCode: "SC",
    region: "Other",
  },
  {
    countryName: "Sierra Leone",
    countryShortCode: "SL",
    region: "Other",
  },
  {
    countryName: "Singapore",
    countryShortCode: "SG",
    region: "Other",
  },
  {
    countryName: "Sint Maarten (Dutch part)",
    countryShortCode: "SX",
    region: "USA",
  },
  {
    countryName: "Slovakia",
    countryShortCode: "SK",
    region: "Europe",
  },
  {
    countryName: "Slovenia",
    countryShortCode: "SI",
    region: "Europe",
  },
  {
    countryName: "Solomon Islands",
    countryShortCode: "SB",
    region: "Australia",
  },
  {
    countryName: "Somalia",
    countryShortCode: "SO",
    region: "Other",
  },
  {
    countryName: "South Africa",
    countryShortCode: "ZA",
    region: "Other",
  },
  {
    countryName: "South Georgia and the South Sandwich Islands",
    countryShortCode: "GS",
    region: "Other",
  },
  {
    countryName: "South Sudan",
    countryShortCode: "SS",
    region: "Other",
  },
  {
    countryName: "Spain",
    countryShortCode: "ES",
    region: "Europe",
  },
  {
    countryName: "Sri Lanka",
    countryShortCode: "LK",
    region: "Other",
  },
  {
    countryName: "Sudan",
    countryShortCode: "SD",
    region: "Other",
  },
  {
    countryName: "Suriname",
    countryShortCode: "SR",
    region: "USA",
  },
  {
    countryName: "Svalbard and Jan Mayen",
    countryShortCode: "SJ",
    region: "Europe",
  },
  {
    countryName: "Swaziland",
    countryShortCode: "SZ",
    region: "Other",
  },
  {
    countryName: "Sweden",
    countryShortCode: "SE",
    region: "Europe",
  },
  {
    countryName: "Switzerland",
    countryShortCode: "CH",
    region: "Europe",
  },
  {
    countryName: "Syrian Arab Republic",
    countryShortCode: "SY",
    region: "Other",
  },
  {
    countryName: "Taiwan, Province of China",
    countryShortCode: "TW",
    region: "Other",
  },
  {
    countryName: "Tajikistan",
    countryShortCode: "TJ",
    region: "Other",
  },
  {
    countryName: "Tanzania, United Republic of",
    countryShortCode: "TZ",
    region: "Other",
  },
  {
    countryName: "Thailand",
    countryShortCode: "TH",
    region: "Other",
  },
  {
    countryName: "Timor-Leste",
    countryShortCode: "TL",
    region: "Other",
  },
  {
    countryName: "Togo",
    countryShortCode: "TG",
    region: "Other",
  },
  {
    countryName: "Tokelau",
    countryShortCode: "TK",
    region: "Other",
  },
  {
    countryName: "Tonga",
    countryShortCode: "TO",
    region: "Australia",
  },
  {
    countryName: "Trinidad and Tobago",
    countryShortCode: "TT",
    region: "USA",
  },
  {
    countryName: "Tunisia",
    countryShortCode: "TN",
    region: "Other",
  },
  {
    countryName: "Turkey",
    countryShortCode: "TR",
    region: "Other",
  },
  {
    countryName: "Turkmenistan",
    countryShortCode: "TM",
    region: "Other",
  },
  {
    countryName: "Turks and Caicos Islands",
    countryShortCode: "TC",
    region: "USA",
  },
  {
    countryName: "Tuvalu",
    countryShortCode: "TV",
    region: "Australia",
  },
  {
    countryName: "Uganda",
    countryShortCode: "UG",
    region: "Other",
  },
  {
    countryName: "Ukraine",
    countryShortCode: "UA",
    region: "Europe",
  },
  {
    countryName: "United Arab Emirates",
    countryShortCode: "AE",
    region: "Other",
  },
  {
    countryName: "United Kingdom",
    countryShortCode: "GB",
    region: "Europe",
  },
  {
    countryName: "United States",
    countryShortCode: "US",
    region: "USA",
  },
  {
    countryName: "United States Minor Outlying Islands",
    countryShortCode: "UM",
    region: "USA",
  },
  {
    countryName: "Uruguay",
    countryShortCode: "UY",
    region: "USA",
  },
  {
    countryName: "Uzbekistan",
    countryShortCode: "UZ",
    region: "Other",
  },
  {
    countryName: "Vanuatu",
    countryShortCode: "VU",
    region: "Australia",
  },
  {
    countryName: "Venezuela, Bolivarian Republic of",
    countryShortCode: "VE",
    region: "USA",
  },
  {
    countryName: "Viet Nam",
    countryShortCode: "VN",
    region: "Other",
  },
  {
    countryName: "Virgin Islands, British",
    countryShortCode: "VG",
    region: "USA",
  },
  {
    countryName: "Virgin Islands, U.S.",
    countryShortCode: "VI",
    region: "USA",
  },
  {
    countryName: "Wallis and Futuna",
    countryShortCode: "WF",
    region: "Other",
  },
  {
    countryName: "Western Sahara",
    countryShortCode: "EH",
    region: "Other",
  },
  {
    countryName: "Yemen",
    countryShortCode: "YE",
    region: "Other",
  },
  {
    countryName: "Zambia",
    countryShortCode: "ZM",
    region: "Other",
  },
  {
    countryName: "Zimbabwe",
    countryShortCode: "ZW",
    region: "Other",
  },
];

module.exports = { COUNTRIES };

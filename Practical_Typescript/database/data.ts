import { NewPhoneData, NewApikeyData } from "../types";

const allApiKeys = [
  {
    apiKey: 'api1'
  },
  {
    apiKey: 'api2'
  },
  {
    apiKey: 'api3'
  },
] as Array<NewApikeyData>;

const allMSISDN: NewPhoneData[] = [
  {
    mno: 'Vodafone',
    countryCode: "30",
    subscriberNumber: '3069523',
    country: 'GR'
  },
  {
    mno: 'Vodafone',
    countryCode: "30",
    subscriberNumber: '306951',
    country: 'GR'
  },
  {
    mno: 'Vodafone',
    countryCode: "30",
    subscriberNumber: '30694',
    country: 'GR'
  },
];

export {
  allApiKeys,
  allMSISDN
};
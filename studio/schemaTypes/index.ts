import { lunchPrices, lunchWeek } from "./lunchMenu";
import operatingStatus from "./operatingStatus";
import { menuSchemaTypes } from "./menu";
import { homeSchemaTypes } from "./homeContent";

export const schemaTypes = [operatingStatus, lunchWeek, lunchPrices, ...menuSchemaTypes, ...homeSchemaTypes];

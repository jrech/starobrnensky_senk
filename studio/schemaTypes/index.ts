import lunchMenu from "./lunchMenu";
import operatingStatus from "./operatingStatus";
import { menuSchemaTypes } from "./menu";
import { homeSchemaTypes } from "./homeContent";

export const schemaTypes = [operatingStatus, lunchMenu, ...menuSchemaTypes, ...homeSchemaTypes];

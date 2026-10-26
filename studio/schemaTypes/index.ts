import lunchMenu from "./lunchMenu";
import operatingStatus from "./operatingStatus";
import { menuSchemaTypes } from "./menu";

export const schemaTypes = [operatingStatus, lunchMenu, ...menuSchemaTypes];

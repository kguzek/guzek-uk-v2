import { Request, Response } from "express";
import { WhereOptions } from "sequelize";
import { getLogger } from "./middleware/logging";
import { Page, PageContent, Token, Updated, User } from "./sequelize";

const logger = getLogger(__filename);

export type ModelType =
  | typeof Page
  | typeof PageContent
  | typeof User
  | typeof Token;

type Model = Page | PageContent | User | Token;

export interface UserObj {
  uuid: string;
  name: string;
  surname: string;
  email: string;
  admin?: boolean;
}

const STATUS_CODES: { [code: number]: string } = {
  200: "OK",
  400: "Bad Request",
  401: "Unauthorised",
  403: "Forbidden",
  404: "Not Found",
  500: "Internal Server Error",
};

interface ServerError {
  name?: string;
  message: string;
}

/** Updates the 'timestamp' column for the given endpoint in the 'updated' table with the current Epoch time. */
async function updateEndpoint(endpointClass: ModelType) {
  const newValue = { timestamp: new Date().getTime() };
  const endpoint = endpointClass.tableName;
  const row = await Updated.findOne({ where: { endpoint } });
  if (row) {
    await row.set(newValue).save();
  } else {
    await Updated.create({ endpoint, ...newValue });
  }
  logger.debug(`Updated endpoint '${endpoint}'`);
}

/** Sends the response with a 200 status and JSON body containing the given data object. */
export function sendOK(
  res: Response,
  data: object | object[],
  code: number = 200
) {
  logger.response(`${code} ${STATUS_CODES[code] ?? STATUS_CODES[200]}`);
  res.status(code).json(data);
}

/** Sends the response with the given code and the provided error object's message property, i.e.
 *
 * `(res, 404, err) => res.status(404).json({ "404 Not Found": err.message })`
 */
export function sendError(
  res: Response,
  code: number,
  error: ServerError = { message: "Unknown error." }
) {
  const codeDescription = `${code} ${STATUS_CODES[code] ?? STATUS_CODES[500]}`;
  const jsonRes = { [codeDescription]: error.message };
  logger.response(`${codeDescription}: ${error.message}`);
  res.status(code).json(jsonRes);
}

/** Creates a new database entry in the database table model derivative provided.
 *  Sends a response containing the created data, unless `sendMethod` is specified.
 */
export async function createDatabaseEntry(
  model: ModelType,
  req: Request,
  res: Response,
  modelParams?: object,
  sendMethod?: Function
) {
  let obj;
  try {
    obj = await model.create(modelParams ?? req.body);
  } catch (error) {
    return void sendError(res, 400, error as Error);
  }
  await updateEndpoint(model);
  (sendMethod ?? sendOK)(res, obj, 201);
}

/** Retrieves all entries in the database table model derivative provided. */
export async function readAllDatabaseEntries<T extends ModelType>(
  model: T,
  res: Response,
  callback?: (res: Response, data: InstanceType<T>[]) => void
) {
  let objs;
  try {
    objs = await model.findAll();
  } catch (error) {
    return void sendError(res, 500, error as Error);
  }
  (callback ?? sendOK)(res, objs as InstanceType<T>[]);
}

/** Retrieves all entries in the database with the provided values and returns the array. */
export async function readDatabaseEntry(
  model: ModelType,
  res: Response,
  filter: WhereOptions,
  onError?: Function
) {
  let objs;
  try {
    objs = await model.findAll({ where: filter });
    if (objs.length === 0) {
      throw Error("The database query returned no results.");
    }
  } catch (error) {
    if (onError) {
      return void onError(error);
    } else {
      return void sendError(res, 400, error as Error);
    }
  }
  return objs;
}

/** Updates the entry with the request payload in the database table model derivative provided.
 *  Sends back a response containing the number of affected rows.
 */
export async function updateDatabaseEntry(
  model: ModelType,
  req: Request,
  res: Response,
  modelParams?: object
) {
  let result: number[];
  try {
    result = await model.update(modelParams ?? req.body, {
      where: req.params,
    });
  } catch (error) {
    return void sendError(res, 400, error as Error);
  }
  await updateEndpoint(model);
  sendOK(res, { affectedRows: result.shift() });
}

/** Deletes the specified entry from the database table model derivative provided.
 *  Sends back a response containing the number of destroyed rows.
 */
export async function deleteDatabaseEntry(
  model: ModelType,
  where: WhereOptions,
  res: Response
) {
  let destroyedRows: number;
  try {
    destroyedRows = await model.destroy({ where });
  } catch (error) {
    return void sendError(res, 400, error as Error);
  }
  await updateEndpoint(model);
  sendOK(res, { destroyedRows });
}